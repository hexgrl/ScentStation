import express from 'express'
import { prisma } from '../lib/prisma.js'

const router = express.Router()

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' })
  next()
}

router.get('/', requireAuth, async (req, res) => {
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
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    const { perfumeId, status } = req.body
    const entry = await prisma.collectionEntry.upsert({
      where: { userId_perfumeId: { userId: req.user.id, perfumeId } },
      update: { status },
      create: { userId: req.user.id, perfumeId, status }
    })
    res.json(entry)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:perfumeId', requireAuth, async (req, res) => {
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
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router