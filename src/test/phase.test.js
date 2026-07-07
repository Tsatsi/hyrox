import { describe, it, expect } from 'vitest'
import { getPhase } from '../utils/phase'

function weeksAfterStart(n) {
  const start = new Date('2026-08-04T00:00:00Z')
  const now = new Date(start.getTime() + n * 7 * 24 * 60 * 60 * 1000)
  return { start, now }
}

describe('getPhase', () => {
  it('returns Phase 1 on week 1 (day 1 of plan)', () => {
    const { start, now } = weeksAfterStart(0.1)
    expect(getPhase(start, now).num).toBe(1)
    expect(getPhase(start, now).label).toBe('Phase 1 — Aerobic Base')
  })

  it('returns Phase 1 through end of week 6', () => {
    const { start, now } = weeksAfterStart(5.9)
    expect(getPhase(start, now).num).toBe(1)
  })

  it('returns Phase 2 at start of week 7', () => {
    const { start, now } = weeksAfterStart(6.01)
    expect(getPhase(start, now).num).toBe(2)
    expect(getPhase(start, now).label).toBe('Phase 2 — Capacity & Specificity')
  })

  it('returns Phase 2 through end of week 12', () => {
    const { start, now } = weeksAfterStart(11.9)
    expect(getPhase(start, now).num).toBe(2)
  })

  it('returns Phase 3 at start of week 13', () => {
    const { start, now } = weeksAfterStart(12.01)
    expect(getPhase(start, now).num).toBe(3)
    expect(getPhase(start, now).label).toBe('Phase 3 — Peak & Taper')
  })

  it('returns Phase 3 through end of week 16', () => {
    const { start, now } = weeksAfterStart(15.9)
    expect(getPhase(start, now).num).toBe(3)
  })

  it('returns Race Week after week 16', () => {
    const { start, now } = weeksAfterStart(17)
    expect(getPhase(start, now).label).toBe('Race Week')
  })

  it('each phase has the expected weeks label', () => {
    expect(getPhase(...Object.values(weeksAfterStart(0.5))).weeks).toBe('Weeks 1–6')
    expect(getPhase(...Object.values(weeksAfterStart(7))).weeks).toBe('Weeks 7–12')
    expect(getPhase(...Object.values(weeksAfterStart(13))).weeks).toBe('Weeks 13–16')
  })
})
