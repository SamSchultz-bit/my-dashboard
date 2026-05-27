export const STATUSES = ['Not Started', 'In Progress', 'Blocked', 'Complete']

export const STATUS_STYLES = {
  'Not Started': 'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Blocked':     'bg-red-100 text-red-700',
  'Complete':    'bg-green-100 text-green-700',
}

export const STATUS_ACTIVE_STYLES = {
  'Not Started': 'bg-gray-500 text-white',
  'In Progress': 'bg-blue-600 text-white',
  'Blocked':     'bg-red-600 text-white',
  'Complete':    'bg-green-600 text-white',
}

export const PROJECT_TYPES = [
  'Mortgage',
  'Auto Loan',
  'Personal Loan',
  'Home Equity',
  'Refinance',
  'Account Opening',
  'Business Loan',
  'Other',
]

export const PRIORITY_LEVELS = ['High', 'Medium', 'Low']

export const PRIORITY_STYLES = {
  High:   'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low:    'bg-slate-100 text-slate-600',
}

export const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 }

export function isOverdue(project) {
  if (!project.dueDate || project.status === 'Complete') return false
  const [y, m, d] = project.dueDate.split('-').map(Number)
  const due = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}
