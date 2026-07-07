import { useState, useEffect } from 'react'
import { getUserId, getUserName, getPersonal, setPersonal, appendToFeed } from '../hooks/useStorage'
import { MEAL_WEEK, MACRO_TARGETS } from '../data/mealPlan'
import ShareModal from './ShareModal'

function getISOWeek() {
  const now = new Date()
  const jan4 = new Date(now.getFullYear(), 0, 4)
  const week = Math.ceil(((now - jan4) / 86400000 + jan4.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}

const MEAL_SLOTS = ['breakfast', 'mid_morning', 'lunch', 'afternoon_snack', 'dinner']
const SLOT_LABELS = {
  breakfast: 'Breakfast',
  mid_morning: 'Mid-Morning',
  lunch: 'Lunch',
  afternoon_snack: 'Afternoon Snack',
  dinner: 'Dinner',
}

export default function MealWeek({ groupId }) {
  const userId = getUserId()
  const weekKey = `meal:${getISOWeek()}`
  const [logged, setLogged] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [shareEvent, setShareEvent] = useState(null)

  useEffect(() => {
    const stored = getPersonal(userId, weekKey)
    setLogged(stored?.loggedDays || [])
  }, [userId, weekKey])

  function toggle(idx) {
    const alreadyDone = logged.includes(idx)
    const next = alreadyDone
      ? logged.filter(i => i !== idx)
      : [...logged, idx]

    setLogged(next)
    setPersonal(userId, weekKey, { loggedDays: next })

    if (!alreadyDone) {
      const day = MEAL_WEEK[idx]
      const baseEvent = {
        userId,
        userName: getUserName() || 'An athlete',
        groupId,
        week: getISOWeek(),
        timestamp: new Date().toISOString(),
      }

      if (groupId) {
        if (next.length === 7) {
          const goalEvent = { ...baseEvent, type: 'meal_goal', dayLabel: null }
          appendToFeed(groupId, goalEvent)
          setShareEvent(goalEvent)
        } else {
          const dailyEvent = { ...baseEvent, type: 'daily_meal', dayLabel: day.day }
          appendToFeed(groupId, dailyEvent)
          setShareEvent(dailyEvent)
        }
      }
    }
  }

  const doneCount = logged.length

  return (
    <section className="px-4 py-8 max-w-4xl mx-auto border-t border-hyrox-border">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold text-white">This Week's Meals</h2>
          <p className="text-gray-500 text-sm mt-0.5">South African performance nutrition</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-orange-500">{doneCount}</span>
          <span className="text-gray-600 text-lg font-bold">/7</span>
          {doneCount === 7 && <p className="text-xs text-green-400 font-semibold">Week complete!</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          `Carbs: ${MACRO_TARGETS.carbs_g_per_kg.min}–${MACRO_TARGETS.carbs_g_per_kg.max} g/kg/day`,
          `Protein: ${MACRO_TARGETS.protein_g_per_kg.min}–${MACRO_TARGETS.protein_g_per_kg.max} g/kg/day`,
          `Fat: ${MACRO_TARGETS.fat_pct.min}–${MACRO_TARGETS.fat_pct.max}% of calories`,
        ].map(label => (
          <span key={label} className="text-xs bg-hyrox-card border border-hyrox-border text-gray-400 px-3 py-1 rounded-full">
            {label}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {MEAL_WEEK.map((day, idx) => {
          const done = logged.includes(idx)
          const open = expanded === idx
          return (
            <div
              key={day.day}
              className={`rounded-xl border transition-all ${
                done ? 'bg-green-900/10 border-green-800/40' : 'bg-hyrox-card border-hyrox-border'
              }`}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggle(idx)}
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                      done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-600 hover:border-orange-500'
                    }`}
                  >
                    {done && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${done ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {day.day}
                      </span>
                      <span className="text-xs text-orange-400 font-medium">{day.theme}</span>
                    </div>
                    <p className={`text-xs mt-0.5 truncate ${done ? 'text-gray-600' : 'text-gray-400'}`}>
                      {day.breakfast}
                    </p>
                  </div>

                  <button
                    onClick={() => setExpanded(open ? null : idx)}
                    className="text-gray-600 hover:text-gray-300 transition-colors p-1"
                  >
                    <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {open && (
                  <div className="mt-3 ml-9 space-y-2 border-t border-hyrox-border pt-3">
                    {MEAL_SLOTS.map(slot => (
                      <div key={slot} className="flex gap-2">
                        <span className="text-xs text-gray-600 w-28 flex-shrink-0 pt-0.5">{SLOT_LABELS[slot]}</span>
                        <span className="text-xs text-gray-300">{day[slot]}</span>
                      </div>
                    ))}
                  </div>
                )}
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
