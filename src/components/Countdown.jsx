import { useState, useEffect } from 'react'
import { getUserId, getPersonal, setPersonal } from '../hooks/useStorage'
import { getPhase } from '../utils/phase'

const RACE_DATE = new Date('2026-11-28T06:00:00')

function getTimeLeft() {
  const now = new Date()
  const diff = RACE_DATE - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

function Digit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-hyrox-card border border-hyrox-border rounded-xl px-4 py-3 min-w-[72px] text-center">
        <span className="text-4xl sm:text-5xl font-black tabular-nums text-white">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-gray-500 mt-2 uppercase tracking-widest">{label}</span>
    </div>
  )
}

export default function Countdown({ userName }) {
  const [time, setTime] = useState(getTimeLeft())
  const [startDate, setStartDate] = useState(null)
  const [editing, setEditing] = useState(false)
  const [inputDate, setInputDate] = useState('')
  const userId = getUserId()

  useEffect(() => {
    const stored = getPersonal(userId, 'planStartDate')
    const date = stored ? new Date(stored) : new Date()
    setStartDate(date)
    setInputDate(date.toISOString().split('T')[0])
  }, [userId])

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  function saveStartDate() {
    const d = new Date(inputDate)
    if (isNaN(d)) return
    setPersonal(userId, 'planStartDate', inputDate)
    setStartDate(d)
    setEditing(false)
  }

  const phase = startDate ? getPhase(startDate) : null

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-hyrox-card to-hyrox-dark border-b border-hyrox-border px-4 py-10 sm:py-16 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent pointer-events-none" />

      <p className="text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-2">
        HYROX Johannesburg · Nasrec Expo Centre
      </p>
      <h1 className="text-3xl sm:text-5xl font-black text-white mb-1">
        Nov 28–29, 2026
      </h1>
      {userName && (
        <p className="text-gray-400 text-sm mb-6">Training with you, <span className="text-white font-semibold">{userName}</span></p>
      )}

      <div className="flex justify-center gap-3 sm:gap-5 mt-6 mb-8">
        <Digit value={time.days} label="Days" />
        <div className="text-3xl font-black text-orange-500 self-center pb-5">:</div>
        <Digit value={time.hours} label="Hours" />
        <div className="text-3xl font-black text-orange-500 self-center pb-5">:</div>
        <Digit value={time.minutes} label="Mins" />
        <div className="text-3xl font-black text-orange-500 self-center pb-5">:</div>
        <Digit value={time.seconds} label="Secs" />
      </div>

      {phase && (
        <div className="inline-flex items-center gap-2 bg-hyrox-card border border-hyrox-border rounded-full px-4 py-2">
          <span className={`text-sm font-bold ${phase.color}`}>{phase.label}</span>
          <span className="text-gray-500 text-xs">· {phase.weeks}</span>
        </div>
      )}

      <div className="mt-4">
        {editing ? (
          <div className="flex items-center justify-center gap-2 mt-2">
            <input
              type="date"
              value={inputDate}
              onChange={e => setInputDate(e.target.value)}
              className="bg-hyrox-card border border-hyrox-border text-white rounded-lg px-3 py-1.5 text-sm"
            />
            <button onClick={saveStartDate} className="bg-orange-500 text-white text-sm px-3 py-1.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="text-gray-500 text-sm px-3 py-1.5 hover:text-gray-300">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="text-gray-600 text-xs hover:text-gray-400 underline underline-offset-2 mt-1 transition-colors">
            Set plan start date
          </button>
        )}
      </div>
    </section>
  )
}
