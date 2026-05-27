import { useMemo, useState } from 'react'
import { extractDate } from '../utils/parseDate'
import { isOverdue } from '../utils/constants'
import { StatusFilterChips } from './StatusFilterChips'

function parseItems(projects, activeStatuses) {
  return projects
    .filter(p => activeStatuses.includes(p.status) && !p.archived)
    .flatMap(p => {
      if (!p.nextSteps?.trim()) return []
      const overdue = isOverdue(p)
      return p.nextSteps
        .split('\n')
        .map((rawLine, rawIdx) => ({ rawLine, rawIdx }))
        .map(({ rawLine, rawIdx }) => ({
          rawIdx,
          text: rawLine.replace(/^[-•*]|\d+\.\s*/g, '').trim(),
          projectId: p.id,
          projectName: p.projectName,
          status: p.status,
          overdue,
        }))
        .filter(({ text }) => text)
        .map(item => ({
          ...item,
          key: `${item.projectId}-${item.rawIdx}`,
          date: extractDate(item.text),
        }))
    })
    .sort((a, b) => {
      if (a.overdue !== b.overdue) return a.overdue ? -1 : 1
      if (a.date && b.date) return a.date - b.date
      if (a.date) return -1
      if (b.date) return 1
      return 0
    })
}

/** @param {{ projects: object[], setProjects: function }} props */
export function NextStepsList({ projects, setProjects }) {
  const [activeStatuses, setActiveStatuses] = useState(['Not Started', 'In Progress', 'Blocked'])
  const [completingKeys, setCompletingKeys] = useState(new Set())
  const [pendingRemoval, setPendingRemoval] = useState(null)

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

  function handleCheck(item) {
    if (completingKeys.has(item.key)) return

    setCompletingKeys(prev => new Set([...prev, item.key]))

    const timeoutId = setTimeout(() => {
      removeStep(item.projectId, item.rawIdx)
      setCompletingKeys(prev => {
        const next = new Set(prev)
        next.delete(item.key)
        return next
      })
      setPendingRemoval(null)
    }, 4000)

    setPendingRemoval({ key: item.key, projectId: item.projectId, rawIdx: item.rawIdx, timeoutId })
  }

  function handleUndo() {
    if (!pendingRemoval) return
    clearTimeout(pendingRemoval.timeoutId)
    setCompletingKeys(prev => {
      const next = new Set(prev)
      next.delete(pendingRemoval.key)
      return next
    })
    setPendingRemoval(null)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-indigo-100 px-4 py-3">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
          Next Steps
        </h3>
        <p className="mt-1.5 text-xs text-gray-400">Filter by status</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <StatusFilterChips activeStatuses={activeStatuses} onToggle={toggleStatus} />
        </div>
      </div>

      <ul className="divide-y divide-gray-50">
        {items.length === 0 ? (
          <li className="px-4 py-8 text-center text-sm text-gray-400">
            No next steps for the selected statuses.
          </li>
        ) : (
          items.map(item => {
            const completing = completingKeys.has(item.key)
            return (
              <li
                key={item.key}
                className={`flex gap-3 px-4 py-3 transition-opacity duration-300 ${completing ? 'opacity-40' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={completing}
                  onChange={() => handleCheck(item)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm leading-snug text-gray-800 ${completing ? 'line-through' : ''}`}>
                    {item.text}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="truncate text-xs text-gray-400">{item.projectName}</span>
                    {item.overdue && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">
                        Overdue
                      </span>
                    )}
                    {item.date && (
                      <span className="rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                        {item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })
        )}
      </ul>

      {pendingRemoval && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2">
          <span className="text-xs text-gray-500">Step marked done</span>
          <button
            onClick={handleUndo}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  )
}
