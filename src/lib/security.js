export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(text)))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function looksHashed(value) {
  return typeof value === 'string' && /^[a-f0-9]{64}$/i.test(value)
}

export async function passwordsMatch(stored, typed) {
  if (!stored || typed == null) return false
  const hashed = await sha256(typed)
  return stored === hashed || stored === typed
}

export function cleanText(value, max = 200) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, max)
}

export function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

export function validPhone(phone) {
  return /^[6-9]\d{9}$/.test(String(phone).replace(/\s/g, ''))
}

const LOCK_KEY = 'trendora-lock'
const MAX_FAILS = 6

export function loginAllowed() {
  try {
    const raw = JSON.parse(sessionStorage.getItem(LOCK_KEY) || '{}')
    if (raw.until && Date.now() < raw.until) {
      return { ok: false, wait: Math.ceil((raw.until - Date.now()) / 1000) }
    }
    return { ok: true, fails: raw.fails || 0 }
  } catch {
    return { ok: true, fails: 0 }
  }
}

export function recordLoginFail() {
  const cur = loginAllowed()
  const fails = (cur.fails || 0) + 1
  const until = fails >= MAX_FAILS ? Date.now() + 30_000 : 0
  sessionStorage.setItem(LOCK_KEY, JSON.stringify({ fails: until ? 0 : fails, until }))
  return until ? { locked: true, wait: 30 } : { locked: false, fails }
}

export function clearLoginFails() {
  sessionStorage.removeItem(LOCK_KEY)
}

export function safeStore(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch {
    try {
      localStorage.removeItem(key)
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch {
      return false
    }
  }
}
