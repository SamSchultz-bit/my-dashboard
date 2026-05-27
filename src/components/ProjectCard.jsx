import { useState } from 'react'
import { STATUS_STYLES, STATUSES, PRIORITY_STYLES, STATUS_BORDER_STYLES } from '../utils/constants'
import { formatDueDate } from '../utils/formatDate'

/** @param {{ project: object, onEdit: function, onDelete: function, onStatusChange: function }} props */
export function ProjectCard({ project, onEdit, onDelete, onStatusChange }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const statusStyle = STATUS_STYLES[project.status] ?? 'bg-gray-100 text-gray-600'
  const priorityStyle = project.priority ? PRIORITY_STYLES[project.priority] : null
  const borderStyle = STATUS_BORDER_STYLES[project.status] ?? 'border-l-gray-300'
  const due = formatDueDate(project.dueDate)

  function handleStatusClick() {
    const idx = STATUSES.indexOf(project.status)
    const next = STATUSES[(idx + 1) % STATUSES.length]
    onStatusChange(project.id, next)
  }

  return (
    <div className={`flex flex-col gap-3 rounded-xl border border-gray-200 border-l-4 bg-white p-5 shadow-sm transition-shadow duration-150 hover:shadow-md ${borderStyle}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-semibold text-gray-900">{project.projectName}</h3>
            {priorityStyle && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyle}`}>
                {project.priority}
              </span>
            )}
          </div>
          {project.projectType && (
            <span className="text-sm text-gray-500">{project.projectType}</span>
          )}
        </div>
        <button
          onClick={handleStatusClick}
          title="Click to advance status"
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-75 cursor-pointer ${statusStyle}`}
        >
          {project.status}
        </button>
      </div>

      <dl className="space-y-1.5 text-sm">
        <Row label="Member" value={project.member} />
        {due && (
          <div className="flex gap-1">
            <dt className="shrink-0 font-medium text-gray-400">Due:</dt>
            <dd className={due.overdue && project.status !== 'Complete' ? 'font-medium text-red-600' : 'text-gray-700'}>
              {due.label}{due.overdue && project.status !== 'Complete' && ' — Overdue'}
            </dd>
          </div>
        )}
        <Row label="Waiting on" value={project.waitingOn} />
        <Row label="Next steps" value={project.nextSteps} />
      </dl>

      <div className="border-t border-gray-100 pt-3">
        {showConfirm ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Delete this project?</span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => onDelete(project.id)}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(project)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Edit
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex gap-1">
      <dt className="shrink-0 font-medium text-gray-500">{label}:</dt>
      <dd className="leading-snug text-gray-700">{value || '—'}</dd>
    </div>
  )
}
