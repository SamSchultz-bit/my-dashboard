import { useMemo, useState } from 'react'
import { isOverdue } from '../utils/constants'
import { formatDueDate } from '../utils/formatDate'
import { StatusFilterChips } from './StatusFilterChips'
import { STATUS_STYLES } from '../utils/constants'

function buildItems(projects, activeStatuses) {
  return projects
    .filter(p => activeStatuses.includes(p.status) && p.waitingOn?.trim())
    .map(p => ({
      key: p.id,
      text: p.waitingOn.trim(),
      projectName: p.projectName,
      status: p.status,
      due: formatDueDate(p.dueDate),
      overdue: isOverdue(p),
    }))
    .sort((a, b) => {
      if (a.overdue !== b.overdue) return a.overdue ? -1 : 1
      if (!a.due && !b.due) return 0
      if (!a.due) return 1
      if (!b.due) return -1
      return (a.due.short > b.due.short) ? 1 : -1
    })
}

/** @param {{ projects: object[] }} props */
export function WaitingOnList({ projects }) {
  const [activeStatuses, setActiveStatuses] = useState(['Not Started', 'In Progress', 'Blocked'])

  const items = useMemo(
    () => buildItems(projects, activeStatuses),
    [projects, activeStatuses]
  )

  function toggleStatus(status) {
    setActiveStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="font-semibold text-gray-900">Waiting On</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <StatusFilterChips activeStatuses={activeStatuses} onToggle={toggleStatus} />
        </div>
      </div>

      <ul className="divide-y divide-gray-50">
        {items.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-gray-400">
            Nothing waiting on for the current filter.
          </li>
        ) : (
          items.map(item => {
            const statusStyle = STATUS_STYLES[item.status] ?? 'bg-gray-100 text-gray-600'
            return (
              <li key={item.key} className="px-4 py-3">
                <p className="text-sm leading-snug text-gray-800">{item.text}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="truncate text-xs text-gray-400">{item.projectName}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle}`}>
                    {item.status}
                  </span>
                  {item.overdue && (
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">
                      Overdue
                    </span>
                  )}
                  {item.due && (
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                      {item.due.short}
                    </span>
                  )}
                </div>
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}
