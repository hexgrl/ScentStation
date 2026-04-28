import { describe, it, expect } from 'vitest'
import { calculatePages } from './pagination.js'

describe('calculatePages', () => {
  it('returns correct page count for even division', () => {
    expect(calculatePages(100, 20)).toBe(5)
  })

  it('rounds up when total does not divide evenly', () => {
    expect(calculatePages(101, 20)).toBe(6)
  })

  it('returns 1 when total is less than take', () => {
    expect(calculatePages(5, 20)).toBe(1)
  })

  it('returns 1 when total equals take', () => {
    expect(calculatePages(20, 20)).toBe(1)
  })
})