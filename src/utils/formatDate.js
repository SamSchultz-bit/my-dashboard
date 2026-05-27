export function formatDueDate(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const overdue = date < today
  return {
    label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    short: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overdue,
  }
}
