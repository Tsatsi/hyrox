import { useState, useEffect } from 'react'
import Countdown from './components/Countdown'
import WorkoutWeek from './components/WorkoutWeek'
import MealWeek from './components/MealWeek'
import MyCrew from './components/MyCrew'
import { getUserId, getUserName, setUserName, getPersonal, setPersonal } from './hooks/useStorage'

export default function App() {
  const userId = getUserId()
  const [userName, setUserNameState] = useState('')
  const [groupId, setGroupId] = useState(null)
  const [nameInput, setNameInput] = useState('')
  const [nameSaved, setNameSaved] = useState(false)

  useEffect(() => {
    const name = getUserName()
    setUserNameState(name)
    setNameInput(name)
    const gid = getPersonal(userId, 'groupId')
    setGroupId(gid || null)
  }, [userId])

  function saveName() {
    if (!nameInput.trim()) return
    setUserName(nameInput.trim())
    setUserNameState(nameInput.trim())
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2000)
  }

  function handleGroupChange(newGroupId) {
    setGroupId(newGroupId)
    setPersonal(userId, 'groupId', newGroupId)
  }

  return (
    <div className="min-h-screen bg-hyrox-dark">
      <Countdown userName={userName} />

      {!userName && (
        <div className="max-w-4xl mx-auto px-4 py-5">
          <div className="bg-hyrox-card border border-orange-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">What's your name?</p>
              <p className="text-xs text-gray-500 mt-0.5">Used in your crew's achievement feed when you share a link.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveName()}
                placeholder="Your name…"
                className="flex-1 sm:w-40 bg-hyrox-dark border border-hyrox-border text-white placeholder-gray-600 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={saveName}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl transition-colors text-sm"
              >
                {nameSaved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {userName && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              Signed in as <span className="text-gray-400">{userName}</span>
            </span>
            <button
              onClick={() => {
                setUserName('')
                setUserNameState('')
                setNameInput('')
              }}
              className="text-xs text-gray-700 hover:text-gray-500 underline underline-offset-2"
            >
              Change name
            </button>
          </div>
        </div>
      )}

      <WorkoutWeek groupId={groupId} />
      <MealWeek groupId={groupId} />
      <MyCrew groupId={groupId} onGroupChange={handleGroupChange} />

      <footer className="border-t border-hyrox-border mt-8 px-4 py-6 text-center">
        <p className="text-xs text-gray-700">
          HYROX Johannesburg · Nasrec Expo Centre · Nov 28–29, 2026
        </p>
        <p className="text-xs text-gray-800 mt-1">
          ~1,750m altitude · Start 10–15 sec/km slower than sea-level pace · Hydrate 3.5–4.5 L/day
        </p>
      </footer>
    </div>
  )
}
