const USER_ID_KEY = 'hyrox:userId'
const USER_NAME_KEY = 'hyrox:userName'

export function getUserId() {
  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}

export function getUserName() {
  return localStorage.getItem(USER_NAME_KEY) || ''
}

export function setUserName(name) {
  localStorage.setItem(USER_NAME_KEY, name)
}

function personalKey(userId, key) {
  return `hyrox:personal:${userId}:${key}`
}

function sharedKey(groupId, key) {
  return `hyrox:shared:${groupId}:${key}`
}

export function getPersonal(userId, key) {
  try {
    const raw = localStorage.getItem(personalKey(userId, key))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setPersonal(userId, key, value) {
  try {
    localStorage.setItem(personalKey(userId, key), JSON.stringify(value))
  } catch {
    // storage full or unavailable
  }
}

export function getShared(groupId, key) {
  try {
    const raw = localStorage.getItem(sharedKey(groupId, key))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setShared(groupId, key, value) {
  try {
    localStorage.setItem(sharedKey(groupId, key), JSON.stringify(value))
  } catch {
    // storage full or unavailable
  }
}

export function appendToFeed(groupId, event) {
  const feed = getShared(groupId, 'feed') || []
  feed.unshift(event)
  setShared(groupId, 'feed', feed.slice(0, 100))
}

export function getFeed(groupId) {
  return getShared(groupId, 'feed') || []
}

export function encodeInvite(groupId, groupName) {
  return btoa(JSON.stringify({ groupId, groupName }))
}

export function decodeInvite(code) {
  try {
    return JSON.parse(atob(code))
  } catch {
    return null
  }
}

export function encodeAchievement(event) {
  return btoa(JSON.stringify(event))
}

export function decodeAchievement(payload) {
  try {
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export function ingestAchievementFromUrl(groupId) {
  const params = new URLSearchParams(window.location.search)
  const payload = params.get('achievement')
  if (!payload) return null
  const event = decodeAchievement(payload)
  if (!event || event.groupId !== groupId) return null
  appendToFeed(groupId, event)
  // clean URL without reloading
  window.history.replaceState({}, '', window.location.pathname)
  return event
}
