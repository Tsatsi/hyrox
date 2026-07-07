export function getPhase(startDate, now = new Date()) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  const week = Math.ceil((now - startDate) / msPerWeek)
  if (week <= 6) return { num: 1, label: 'Phase 1 — Aerobic Base', weeks: 'Weeks 1–6', color: 'text-blue-400' }
  if (week <= 12) return { num: 2, label: 'Phase 2 — Capacity & Specificity', weeks: 'Weeks 7–12', color: 'text-orange-400' }
  if (week <= 16) return { num: 3, label: 'Phase 3 — Peak & Taper', weeks: 'Weeks 13–16', color: 'text-red-400' }
  return { num: 3, label: 'Race Week', weeks: 'Final Push', color: 'text-red-500' }
}
