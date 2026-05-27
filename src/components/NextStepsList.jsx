import { useMemo, useState } from 'react'
import { extractDate } from '../utils/parseDate'

const STATUSES = ['Not Started', 'In Progress', 'Blocked', 'Complete']

const STATUS_STYLES = {
  'Not Started': 'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Blocked':     'bg-red-100 text-red-700',
  'Complete':    'bg-green-100 text-green-700',
}

const STATUS_ACTIVE_STYLES = {
  'Not Started': 'bg-gray-500 text-white',
  'In Progress': 'bg-blue-600 text-white',
  'Blocked':     'bg-red-600 text-white',
  'Complete':    'bg-green-600 text-white',
}

function parseItems(projects, activeStatuses) {
  return projects
    .filter(p => activeStatuses.includes(p.status))
    .flatMap(p => {
      if (!p.nextSteps?.trim()) return []
      return p.nextSteps
        .split('\n')
        .map((rawLine, rawIdx) => ({ rawLine, rawIdx }))
        .map(({ rawLine, rawIdx }) => ({
          rawIdx,
          text: rawLine.replace(/^[-•*]|\d+\.\s*/g, '').trim(),
          projectId: p.id,
          projectName: p.projectName,
          status: p.status,
        }))
        .filter(({ text }) => text)
        .map(item => ({
          ...item,
          key: `${item.projectId}-${item.rawIdx}`,
          date: extractDate(item.text),
        }))
    })
    .sort((a, b) => {
      if (a.date && b.date) return a.date - b.date
      if (a.date) return -1
      if (b.date) return 1
      return 0
    })
}

/** @param {{ projects: object[], setProjects: function }} props */
export function NextStepsList({ projects, setProjects }) {
  const [activeStatuses, setActiveStatuses] = useState(['Not Started', 'In Progress', 'Blocked'])

  const items = useMemo(
    () => parseItems(projects, activeStatuses),
    [projects, activeStatuses]
  )

  function toggleStatus(status) {
    setActiveStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  function removeStep(projectId, rawIdx) {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p
        const lines = p.nextSteps.split('\n')
        lines.splice(rawIdx, 1)
        return { ...p, nextSteps: lines.join('\n').trim() }
      })
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="font-semibold text-gray-900">Next Steps</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {STATUSES.map(status => {
            const active = activeStatuses.includes(status)
            const style = active ? STATUS_ACTIVE_STYLES[status] : STATUS_STYLES[status]
            return (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${style}`}
              >
                {status}
              </button>
            )
          })}
        </div>
      </div>

      <ul className="max-h-[calc(100vh-12rem)] divide-y divide-gray-50 overflow-y-auto">
        {items.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-gray-400">
            No next steps match the current filter.
          </li>
        ) : (
          items.map(item => (
            <li key={item.key} className="flex gap-3 px-4 py-3">
              <input
                type="checkbox"
                checked={false}
                onChange={() => removeStep(item.projectId, item.rawIdx)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-blue-600"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-gray-800">{item.text}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="truncate text-xs text-gray-400">{item.projectName}</span>
                  {item.date && (
                    <span className="rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                      {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
