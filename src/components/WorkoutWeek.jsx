import { useState, useEffect } from 'react'
import { getUserId, getUserName, getPersonal, setPersonal, appendToFeed } from '../hooks/useStorage'
import { WORKOUT_WEEK, ZONE_COLORS } from '../data/workoutPlan'
import ShareModal from './ShareModal'

function getISOWeek() {
  const now = new Date()
  const jan4 = new Date(now.getFullYear(), 0, 4)
  const week = Math.ceil(((now - jan4) / 86400000 + jan4.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}

export default function WorkoutWeek({ groupId }) {
  const userId = getUserId()
  const weekKey = `workout:${getISOWeek()}`
  const [completed, setCompleted] = useState([])
  const [shareEvent, setShareEvent] = useState(null)

  useEffect(() => {
    const stored = getPersonal(userId, weekKey)
    setCompleted(stored?.completedDays || [])
  }, [userId, weekKey])

  function toggle(idx) {
    const alreadyDone = completed.includes(idx)
    const next = alreadyDone
      ? completed.filter(i => i !== idx)
      : [...completed, idx]

    setCompleted(next)
    setPersonal(userId, weekKey, { completedDays: next })

    if (!alreadyDone) {
      const day = WORKOUT_WEEK[idx]
      const baseEvent = {
        userId,
        userName: getUserName() || 'An athlete',
        groupId,
        week: getISOWeek(),
        timestamp: new Date().toISOString(),
      }

      if (groupId) {
        if (next.length === 7) {
          const goalEvent = { ...baseEvent, type: 'workout_goal', dayLabel: null }
          appendToFeed(groupId, goalEvent)
          setShareEvent(goalEvent)
        } else {
          const dailyEvent = { ...baseEvent, type: 'daily_workout', dayLabel: day.day }
          appendToFeed(groupId, dailyEvent)
          setShareEvent(dailyEvent)
        }
      }
    }
  }

  const doneCount = completed.length

  return (
    <section className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">This Week's Workouts</h2>
          <p className="text-gray-500 text-sm mt-0.5">Phase 2 · Capacity & Specificity</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-orange-500">{doneCount}</span>
          <span className="text-gray-600 text-lg font-bold">/7</span>
          {doneCount === 7 && <p className="text-xs text-green-400 font-semibold">Week complete!</p>}
        </div>
      </div>

      <div className="space-y-3">
        {WORKOUT_WEEK.map((session, idx) => {
          const done = completed.includes(idx)
          return (
            <div
              key={session.day}
              className={`rounded-xl border transition-all ${
                done
                  ? 'bg-green-900/10 border-green-800/40'
                  : 'bg-hyrox-card border-hyrox-border'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggle(idx)}
                    className={`mt-0.5 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      done
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-600 hover:border-orange-500'
                    }`}
                  >
                    {done && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-sm font-bold ${done ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {session.day}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ZONE_COLORS[session.zone]}`}>
                        {session.zone}
                      </span>
                    </div>
                    <p className={`font-semibold text-sm ${done ? 'text-gray-600' : 'text-gray-200'}`}>
                      {session.focus}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{session.objective}</p>

                    <div className="mt-2 space-y-1">
                      {session.exercises.map((ex, i) => (
                        <div key={i} className="flex items-baseline gap-2">
                          <span className={`text-xs font-medium ${done ? 'text-gray-600' : 'text-gray-300'}`}>
                            {ex.name}
                          </span>
                          <span className="text-xs text-gray-600">— {ex.detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {shareEvent && (
        <ShareModal event={shareEvent} onClose={() => setShareEvent(null)} />
      )}
    </section>
  )
}
