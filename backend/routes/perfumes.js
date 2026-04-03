import express from 'express'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

router.get('/', async (req, res) => {
  try {
    const { search, accord, gender, page = 1 } = req.query
    const take = 24
    const skip = (page - 1) * take

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(gender && { gender }),
      ...(accord && {
        accords: {
          some: {
            accord: { name: { equals: accord, mode: 'insensitive' } }
          }
        }
      })
    }

    const [perfumes, total] = await Promise.all([
      prisma.perfume.findMany({
        where,
        skip,
        take,
        include: {
          accords: { include: { accord: true }, orderBy: { rank: 'asc' } }
        }
      }),
      prisma.perfume.count({ where })
    ])

    res.json({ perfumes, total, page: Number(page), pages: Math.ceil(total / take) })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const perfume = await prisma.perfume.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        accords: { include: { accord: true }, orderBy: { rank: 'asc' } },
        notes: { include: { note: true } }
      }
    })

    if (!perfume) return res.status(404).json({ error: 'Not found' })
    res.json(perfume)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router