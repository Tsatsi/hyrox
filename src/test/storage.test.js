import { describe, it, expect } from 'vitest'
import {
  encodeInvite,
  decodeInvite,
  encodeAchievement,
  decodeAchievement,
  appendToFeed,
  getFeed,
  getPersonal,
  setPersonal,
  ingestAchievementFromUrl,
} from '../hooks/useStorage'

// ─── Seam A: invite encoding ────────────────────────────────────────────────

describe('encodeInvite / decodeInvite', () => {
  it('round-trips groupId and groupName', () => {
    const code = encodeInvite('group-123', 'JHB Racing Squad')
    expect(decodeInvite(code)).toEqual({ groupId: 'group-123', groupName: 'JHB Racing Squad' })
  })

  it('returns null for garbage input', () => {
    expect(decodeInvite('not-valid-base64!!!!')).toBeNull()
  })

  it('returns null for valid base64 that is not JSON', () => {
    expect(decodeInvite(btoa('hello world'))).toBeNull()
  })
})

// ─── Seam A: achievement encoding ──────────────────────────────────────────

describe('encodeAchievement / decodeAchievement', () => {
  it('round-trips a daily_workout event', () => {
    const event = {
      userId: 'u1',
      userName: 'Alice',
      groupId: 'g1',
      type: 'daily_workout',
      dayLabel: 'Monday',
      week: '2026-W28',
      timestamp: '2026-07-06T08:00:00.000Z',
    }
    expect(decodeAchievement(encodeAchievement(event))).toEqual(event)
  })

  it('returns null for garbage input', () => {
    expect(decodeAchievement('!!!garbage!!!')).toBeNull()
  })
})

// ─── Seam B: feed management ────────────────────────────────────────────────

describe('appendToFeed / getFeed', () => {
  it('returns empty array when no events exist', () => {
    expect(getFeed('group-empty')).toEqual([])
  })

  it('prepends events so newest is first', () => {
    appendToFeed('g1', { type: 'daily_workout', timestamp: '2026-07-06T08:00:00Z' })
    appendToFeed('g1', { type: 'daily_meal', timestamp: '2026-07-06T09:00:00Z' })
    const feed = getFeed('g1')
    expect(feed[0].type).toBe('daily_meal')
    expect(feed[1].type).toBe('daily_workout')
  })

  it('caps the feed at 100 events', () => {
    const groupId = 'g-cap'
    for (let i = 0; i < 105; i++) {
      appendToFeed(groupId, { type: 'daily_workout', i })
    }
    expect(getFeed(groupId)).toHaveLength(100)
  })

  it('isolates feeds by groupId', () => {
    appendToFeed('groupA', { type: 'daily_workout' })
    expect(getFeed('groupB')).toEqual([])
  })
})

// ─── Seam B: personal storage ───────────────────────────────────────────────

describe('getPersonal / setPersonal', () => {
  it('stores and retrieves a value under the correct user', () => {
    setPersonal('user-1', 'workout:2026-W28', { completedDays: [0, 1] })
    expect(getPersonal('user-1', 'workout:2026-W28')).toEqual({ completedDays: [0, 1] })
  })

  it('isolates values by userId', () => {
    setPersonal('user-1', 'someKey', { value: 'A' })
    expect(getPersonal('user-2', 'someKey')).toBeNull()
  })

  it('returns null for a key that was never set', () => {
    expect(getPersonal('user-1', 'nonexistent')).toBeNull()
  })
})

// ─── Seam C: URL ingest ─────────────────────────────────────────────────────

describe('ingestAchievementFromUrl', () => {
  function setSearchParam(param, value) {
    Object.defineProperty(window, 'location', {
      value: { search: `?${param}=${value}`, pathname: '/' },
      writable: true,
    })
    window.history.replaceState = () => {}
  }

  it('returns null and does nothing when no achievement param is present', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '', pathname: '/' },
      writable: true,
    })
    window.history.replaceState = () => {}
    expect(ingestAchievementFromUrl('g1')).toBeNull()
    expect(getFeed('g1')).toEqual([])
  })

  it('ingests a valid achievement into the matching group feed', () => {
    const event = {
      userId: 'u1',
      userName: 'Alice',
      groupId: 'g-match',
      type: 'daily_workout',
      dayLabel: 'Monday',
      week: '2026-W28',
      timestamp: '2026-07-06T08:00:00.000Z',
    }
    setSearchParam('achievement', encodeAchievement(event))
    const result = ingestAchievementFromUrl('g-match')
    expect(result).toEqual(event)
    expect(getFeed('g-match')).toHaveLength(1)
    expect(getFeed('g-match')[0].userName).toBe('Alice')
  })

  it('rejects an achievement whose groupId does not match the current user group', () => {
    const event = {
      userId: 'u1',
      userName: 'Alice',
      groupId: 'other-group',
      type: 'daily_workout',
      dayLabel: 'Monday',
      week: '2026-W28',
      timestamp: '2026-07-06T08:00:00.000Z',
    }
    setSearchParam('achievement', encodeAchievement(event))
    expect(ingestAchievementFromUrl('my-group')).toBeNull()
    expect(getFeed('my-group')).toEqual([])
  })

  it('rejects a malformed achievement payload', () => {
    setSearchParam('achievement', '!!!garbage!!!')
    expect(ingestAchievementFromUrl('g1')).toBeNull()
  })
})
