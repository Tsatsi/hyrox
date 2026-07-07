import { useState, useEffect, useCallback } from 'react'
import {
  getUserId,
  getPersonal,
  setPersonal,
  getFeed,
  encodeInvite,
  decodeInvite,
  ingestAchievementFromUrl,
} from '../hooks/useStorage'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function eventLabel(e) {
  switch (e.type) {
    case 'daily_workout': return `completed ${e.dayLabel} workout`
    case 'daily_meal': return `logged ${e.dayLabel} meals`
    case 'workout_goal': return 'hit their 7/7 workout goal this week'
    case 'meal_goal': return 'hit their 7/7 meal goal this week'
    default: return 'achieved something'
  }
}

function eventEmoji(type) {
  if (type === 'daily_workout' || type === 'workout_goal') return '💪'
  if (type === 'daily_meal' || type === 'meal_goal') return '🥗'
  return '🏆'
}

function isMilestone(type) {
  return type === 'workout_goal' || type === 'meal_goal'
}

export default function MyCrew({ groupId, onGroupChange }) {
  const userId = getUserId()
  const [feed, setFeed] = useState([])
  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [inviteCopied, setInviteCopied] = useState(false)
  const [groupName, setGroupName] = useState('')

  const loadFeed = useCallback(() => {
    if (!groupId) return
    setFeed(getFeed(groupId))
  }, [groupId])

  useEffect(() => {
    const stored = getPersonal(userId, 'groupName')
    if (stored) setGroupName(stored)
  }, [userId])

  useEffect(() => {
    if (!groupId) return
    const ingested = ingestAchievementFromUrl(groupId)
    if (ingested) loadFeed()
  }, [groupId, loadFeed])

  useEffect(() => {
    loadFeed()
    const id = setInterval(loadFeed, 30000)
    return () => clearInterval(id)
  }, [loadFeed])

  function createGroup() {
    const name = prompt('Name your crew (e.g. "JHB Racing Squad"):')
    if (!name?.trim()) return
    const newGroupId = crypto.randomUUID()
    setPersonal(userId, 'groupId', newGroupId)
    setPersonal(userId, 'groupName', name.trim())
    setGroupName(name.trim())
    onGroupChange(newGroupId)
  }

  function copyInvite() {
    if (!groupId) return
    const code = encodeInvite(groupId, groupName)
    navigator.clipboard.writeText(code).then(() => {
      setInviteCopied(true)
      setTimeout(() => setInviteCopied(false), 2000)
    })
  }

  function joinGroup() {
    setJoinError('')
    const decoded = decodeInvite(joinCode.trim())
    if (!decoded?.groupId) {
      setJoinError('Invalid invite code. Ask your crew for the code.')
      return
    }
    setPersonal(userId, 'groupId', decoded.groupId)
    setPersonal(userId, 'groupName', decoded.groupName || 'My Crew')
    setGroupName(decoded.groupName || 'My Crew')
    onGroupChange(decoded.groupId)
    setJoinCode('')
  }

  return (
    <section className="px-4 py-8 max-w-4xl mx-auto border-t border-hyrox-border">
      <h2 className="text-xl font-bold text-white mb-1">My Crew</h2>
      <p className="text-gray-500 text-sm mb-6">
        Train together. Share daily wins. Hold each other accountable.
      </p>

      {!groupId ? (
        <div className="space-y-4">
          <div className="bg-hyrox-card border border-hyrox-border rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Start a crew</h3>
            <p className="text-gray-500 text-sm mb-4">Create a group and share the invite code with your training partners on WhatsApp.</p>
            <button
              onClick={createGroup}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Create Crew
            </button>
          </div>

          <div className="bg-hyrox-card border border-hyrox-border rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Join a crew</h3>
            <p className="text-gray-500 text-sm mb-3">Paste the invite code your training partner shared.</p>
            <div className="flex gap-2">
              <input
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                placeholder="Paste invite code…"
                className="flex-1 bg-hyrox-dark border border-hyrox-border text-white placeholder-gray-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={joinGroup}
                disabled={!joinCode.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
              >
                Join
              </button>
            </div>
            {joinError && <p className="text-red-400 text-xs mt-2">{joinError}</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-hyrox-card border border-hyrox-border rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Your Crew</p>
              <p className="text-white font-bold">{groupName || 'My Crew'}</p>
            </div>
            <button
              onClick={copyInvite}
              className="flex-shrink-0 bg-hyrox-dark border border-hyrox-border hover:border-orange-500 text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-colors font-medium"
            >
              {inviteCopied ? 'Copied!' : 'Copy Invite'}
            </button>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
            <p className="text-xs text-orange-300">
              Your name and daily achievements are visible to all crew members when you share a link.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Crew Feed</h3>
            {feed.length === 0 ? (
              <div className="bg-hyrox-card border border-hyrox-border rounded-xl p-8 text-center">
                <p className="text-gray-600 text-sm">No activity yet.</p>
                <p className="text-gray-700 text-xs mt-1">Complete a workout or meal day to post your first win.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {feed.map((event, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-4 flex items-start gap-3 ${
                      isMilestone(event.type)
                        ? 'bg-orange-900/10 border-orange-500/30'
                        : 'bg-hyrox-card border-hyrox-border'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{eventEmoji(event.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className="font-bold">{event.userName}</span>{' '}
                        <span className="text-gray-400">{eventLabel(event)}</span>
                        {isMilestone(event.type) && (
                          <span className="ml-1 text-orange-400 font-bold">🎉</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">{timeAgo(event.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (confirm('Leave this crew? You can rejoin later with an invite code.')) {
                setPersonal(userId, 'groupId', null)
                setPersonal(userId, 'groupName', null)
                onGroupChange(null)
              }
            }}
            className="text-xs text-gray-700 hover:text-gray-500 underline underline-offset-2"
          >
            Leave crew
          </button>
        </div>
      )}
    </section>
  )
}
