const STATUS_STYLES = {
  'Not Started': 'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Blocked': 'bg-red-100 text-red-700',
  'Complete': 'bg-green-100 text-green-700',
}

function formatDueDate(dateStr) {
  if (!dateStr) return null
  // Parse as local date to avoid UTC-offset display shifts
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const overdue = date < today
  const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return { label, overdue }
}

/** @param {{ project: object, onEdit: function, onDelete: function }} props */
export function ProjectCard({ project, onEdit, onDelete }) {
  const statusStyle = STATUS_STYLES[project.status] ?? 'bg-gray-100 text-gray-600'
  const due = formatDueDate(project.dueDate)

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{project.projectName}</h3>
          {project.projectType && (
            <span className="text-sm text-gray-500">{project.projectType}</span>
          )}
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle}`}>
          {project.status}
        </span>
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

      <div className="flex gap-3 border-t border-gray-100 pt-3">
        <button
          onClick={() => onEdit(project)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="text-sm font-medium text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex gap-1">
      <dt className="font-medium text-gray-400 shrink-0">{label}:</dt>
      <dd className="text-gray-700">{value || '—'}</dd>
    </div>
  )
}
