import express from 'express'
import { prisma } from '../lib/prisma.js'
import { calculatePages } from '../utils/pagination.js'

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { search, accord, note, gender, page = 1 } = req.query
    const take = 20
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
      }),
      ...(note && {
        notes: {
          some: {
            note: { name: { equals: note, mode: 'insensitive' } }
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

    res.json({ perfumes, total, page: Number(page), pages: calculatePages(total, take) })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
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
    next(err)
  }
})

router.get('/:id/similar', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const perfume = await prisma.perfume.findUnique({
      where: { id },
      include: {
        accords: { include: { accord: true }, orderBy: { rank: 'asc' } }
      }
    })

    if (!perfume) return res.status(404).json({ error: 'Not found' })

    const topAccordIds = perfume.accords.slice(0, 3).map(a => a.accordId)

    const similar = await prisma.perfume.findMany({
      where: {
        id: { not: id },
        accords: {
          some: {
            accordId: { in: topAccordIds }
          }
        }
      },
      include: {
        accords: { include: { accord: true }, orderBy: { rank: 'asc' } }
      },
      take: 6
    })

    res.json(similar)
  } catch (err) {
    next(err)
  }
})

export default router