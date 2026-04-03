import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

function toDisplayName(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function parseRating(str) {
  if (!str) return null
  return parseFloat(str.replace(',', '.'))
}

async function main() {
  const file = fs.readFileSync(path.join(__dirname, 'data/fra_cleaned.csv'))
  const rows = parse(file, { columns: true, delimiter: ';' })

  console.log(`Seeding ${rows.length} perfumes...`)

  const allNoteNames = new Set()
  const allAccordNames = new Set()

  for (const row of rows) {
    for (const field of [row.Top, row.Middle, row.Base]) {
      if (field) field.split(',').forEach((n) => allNoteNames.add(n.trim().toLowerCase()))
    }
    for (const a of [row.mainaccord1, row.mainaccord2, row.mainaccord3, row.mainaccord4, row.mainaccord5]) {
      const name = a?.trim().toLowerCase()
      if (name) allAccordNames.add(name)
    }
  }

  console.log(`Upserting ${allNoteNames.size} notes and ${allAccordNames.size} accords...`)

  await prisma.note.createMany({
    data: [...allNoteNames].map((name) => ({ name })),
    skipDuplicates: true,
  })

  await prisma.accord.createMany({
    data: [...allAccordNames].map((name) => ({ name })),
    skipDuplicates: true,
  })

  const noteMap = new Map(
    (await prisma.note.findMany({ select: { id: true, name: true } })).map((n) => [n.name, n.id])
  )
  const accordMap = new Map(
    (await prisma.accord.findMany({ select: { id: true, name: true } })).map((a) => [a.name, a.id])
  )

  const CHUNK = 500

  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK)

    await prisma.perfume.createMany({
      data: chunk.map((row) => ({
        name: toDisplayName(row.Perfume),
        brand: toDisplayName(row.Brand),
        country: row.Country || null,
        gender: row.Gender || null,
        year: row.Year ? parseInt(row.Year) : null,
        ratingValue: parseRating(row['Rating Value']),
        ratingCount: row['Rating Count'] ? parseInt(row['Rating Count'].replace('.', '')) : null,
        perfumer1: row.Perfumer1 && row.Perfumer1 !== 'unknown' ? row.Perfumer1 : null,
        perfumer2: row.Perfumer2 || null,
      })),
      skipDuplicates: true,
    })

    console.log(`Inserted perfumes ${i + 1}–${Math.min(i + CHUNK, rows.length)}`)
  }

  const allPerfumes = await prisma.perfume.findMany({ select: { id: true, name: true, brand: true } })
  const perfumeMap = new Map(allPerfumes.map((p) => [`${p.name}||${p.brand}`, p.id]))

  const perfumeNoteRows = []
  const perfumeAccordRows = []

  for (const row of rows) {
    const perfumeId = perfumeMap.get(`${toDisplayName(row.Perfume)}||${toDisplayName(row.Brand)}`)
    if (!perfumeId) continue

    const noteGroups = [
      { field: row.Top, layer: 'top' },
      { field: row.Middle, layer: 'middle' },
      { field: row.Base, layer: 'base' },
    ]

    for (const { field, layer } of noteGroups) {
      if (!field) continue
      for (const raw of field.split(',')) {
        const name = raw.trim().toLowerCase()
        const noteId = noteMap.get(name)
        if (noteId) perfumeNoteRows.push({ perfumeId, noteId, layer })
      }
    }

    const accordFields = [row.mainaccord1, row.mainaccord2, row.mainaccord3, row.mainaccord4, row.mainaccord5]
    for (let i = 0; i < accordFields.length; i++) {
      const name = accordFields[i]?.trim().toLowerCase()
      const accordId = name && accordMap.get(name)
      if (accordId) perfumeAccordRows.push({ perfumeId, accordId, rank: i + 1 })
    }
  }

  console.log(`Inserting ${perfumeNoteRows.length} note links and ${perfumeAccordRows.length} accord links...`)

  for (let i = 0; i < perfumeNoteRows.length; i += CHUNK) {
    await prisma.perfumeNote.createMany({ data: perfumeNoteRows.slice(i, i + CHUNK), skipDuplicates: true })
  }

  for (let i = 0; i < perfumeAccordRows.length; i += CHUNK) {
    await prisma.perfumeAccord.createMany({ data: perfumeAccordRows.slice(i, i + CHUNK), skipDuplicates: true })
  }

  console.log('Done.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())