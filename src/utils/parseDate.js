const MONTHS = [
  'january','february','march','april','may','june',
  'july','august','september','october','november','december',
]
const MONTHS_SHORT = [
  'jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec',
]

export function extractDate(text) {
  const t = text.toLowerCase()
  const thisYear = new Date().getFullYear()

  // ISO: 2025-03-15
  let m = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)
  if (m) return new Date(+m[1], +m[2] - 1, +m[3])

  // Slash: 3/15 or 3/15/2025
  m = text.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?\b/)
  if (m) return new Date(m[3] ? +m[3] : thisYear, +m[1] - 1, +m[2])

  // Long or short month name: "March 15" / "Mar. 15, 2025" / "March 15th"
  const allMonths = [...MONTHS, ...MONTHS_SHORT]
  const monthPat = allMonths.join('|')
  m = t.match(new RegExp(`\\b(${monthPat})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:[,\\s]+(\\d{4}))?\\b`))
  if (m) {
    let idx = allMonths.indexOf(m[1])
    if (idx >= 12) idx -= 12 // normalize abbr to 0-based
    return new Date(m[3] ? +m[3] : thisYear, idx, +m[2])
  }

  return null
}
