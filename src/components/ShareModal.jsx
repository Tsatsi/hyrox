import { useState } from 'react'
import { encodeAchievement } from '../hooks/useStorage'

export default function ShareModal({ event, onClose }) {
  const [copied, setCopied] = useState(false)

  const payload = encodeAchievement(event)
  const url = `${window.location.origin}${window.location.pathname}?achievement=${payload}`

  function copy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const label = event.type === 'daily_workout'
    ? `completed ${event.dayLabel} workout`
    : event.type === 'daily_meal'
      ? `logged ${event.dayLabel} meals`
      : event.type === 'workout_goal'
        ? 'hit the 7/7 workout goal this week'
        : 'hit the 7/7 meal goal this week'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-hyrox-card border border-hyrox-border rounded-2xl p-6 w-full max-w-sm">
        <div className="text-center mb-5">
          <div className="text-4xl mb-3">
            {event.type.includes('workout') ? '💪' : '🥗'}
          </div>
          <h2 className="text-white font-bold text-lg">
            {event.type === 'workout_goal' || event.type === 'meal_goal' ? 'Goal Smashed!' : 'Day Done!'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            You {label}
          </p>
        </div>

        <div className="bg-hyrox-dark rounded-xl p-3 mb-4 break-all">
          <p className="text-gray-500 text-xs font-mono leading-relaxed">{url}</p>
        </div>

        <p className="text-xs text-gray-600 text-center mb-4">
          Your name and achievement will be visible to your crew.
        </p>

        <div className="flex gap-3">
          <button
            onClick={copy}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl border border-hyrox-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
