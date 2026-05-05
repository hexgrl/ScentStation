import express from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const entries = await prisma.collectionEntry.findMany({
      where: { userId: req.user.id },
      include: {
        perfume: {
          include: {
            accords: { include: { accord: true }, orderBy: { rank: 'asc' } }
          }
        }
      }
    })
    res.json(entries)
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { perfumeId, status } = req.body
    const entry = await prisma.collectionEntry.upsert({
      where: { userId_perfumeId: { userId: req.user.id, perfumeId } },
      update: { status },
      create: { userId: req.user.id, perfumeId, status }
    })
    res.json(entry)
  } catch (err) {
    next(err)
  }
})

router.delete('/:perfumeId', requireAuth, async (req, res, next) => {
  try {
    await prisma.collectionEntry.delete({
      where: {
        userId_perfumeId: {
          userId: req.user.id,
          perfumeId: Number(req.params.perfumeId)
        }
      }
    })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

export default router