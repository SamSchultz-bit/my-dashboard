import { useMemo, useState } from 'react'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectForm } from '../components/ProjectForm'
import { StatusFilterChips } from '../components/StatusFilterChips'
import {
  STATUSES,
  STATUS_STYLES,
  PRIORITY_ORDER,
  isOverdue,
} from '../utils/constants'

const SORT_OPTIONS = [
  { value: 'due',      label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'name',     label: 'Name (A → Z)' },
  { value: 'name-z',   label: 'Name (Z → A)' },
  { value: 'status',   label: 'Status' },
  { value: 'member',   label: 'Member' },
  { value: 'type',     label: 'Project Type' },
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function applyFiltersAndSort(projects, activeStatuses, filterOverdue, searchQuery, sortBy) {
  const q = searchQuery.trim().toLowerCase()
  let result = projects

  if (activeStatuses.length > 0) {
    result = result.filter(p => activeStatuses.includes(p.status))
  }
  if (filterOverdue) {
    result = result.filter(isOverdue)
  }
  if (q) {
    result = result.filter(
      p =>
        p.projectName.toLowerCase().includes(q) ||
        (p.member || '').toLowerCase().includes(q)
    )
  }

  return [...result].sort((a, b) => {
    const aOver = isOverdue(a)
    const bOver = isOverdue(b)
    if (aOver !== bOver) return aOver ? -1 : 1

    switch (sortBy) {
      case 'due': {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      }
      case 'priority': {
        const pa = PRIORITY_ORDER[a.priority] ?? 99
        const pb = PRIORITY_ORDER[b.priority] ?? 99
        return pa - pb
      }
      case 'name':   return a.projectName.localeCompare(b.projectName)
      case 'name-z': return b.projectName.localeCompare(a.projectName)
      case 'status': return STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status)
      case 'member': return (a.member || '').localeCompare(b.member || '')
      case 'type':   return (a.projectType || '').localeCompare(b.projectType || '')
      default:       return 0
    }
  })
}

/** @param {{ projects: object[], setProjects: function }} props */
export function ProjectTracker({ projects, setProjects }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [activeStatuses, setActiveStatuses] = useState([])
  const [filterOverdue, setFilterOverdue] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('due')

  const displayed = useMemo(
    () => applyFiltersAndSort(projects, activeStatuses, filterOverdue, searchQuery, sortBy),
    [projects, activeStatuses, filterOverdue, searchQuery, sortBy]
  )

  const statusCounts = useMemo(() => {
    const counts = {}
    STATUSES.forEach(s => { counts[s] = 0 })
    projects.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1 })
    counts.Overdue = projects.filter(isOverdue).length
    return counts
  }, [projects])

  function handleSave(formData) {
    if (editingProject) {
      setProjects(prev =>
        prev.map(p => (p.id === editingProject.id ? { ...formData, id: editingProject.id } : p))
      )
    } else {
      setProjects(prev => [...prev, { ...formData, id: generateId() }])
    }
    closeForm()
  }

  function handleEdit(project) {
    setEditingProject(project)
    setFormOpen(true)
  }

  function handleDelete(id) {
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  function handleStatusChange(id, newStatus) {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, status: newStatus } : p))
    )
  }

  function closeForm() {
    setFormOpen(false)
    setEditingProject(null)
  }

  function toggleStatus(status) {
    setActiveStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    )
  }

  const total = projects.length
  const showing = displayed.length
  const isFiltered = activeStatuses.length > 0 || filterOverdue || searchQuery.trim()

  function clearFilters() {
    setActiveStatuses([])
    setFilterOverdue(false)
    setSearchQuery('')
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {isFiltered
              ? `${showing} of ${total} ${total === 1 ? 'project' : 'projects'}`
              : `${total} ${total === 1 ? 'project' : 'projects'}`}
          </p>
        </div>
        <button onClick={() => setFormOpen(true)} className="btn-primary">
          + Add Project
        </button>
      </div>

      {total > 0 && (
        <>
          {/* Summary bar */}
          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {STATUSES.map(status => (
              <span key={status} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[status].split(' ')[0]}`} />
                <span className="text-gray-500">{status}:</span>
                <span className="font-semibold text-gray-800">{statusCounts[status]}</span>
              </span>
            ))}
            {statusCounts.Overdue > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-gray-500">Overdue:</span>
                <span className="font-semibold text-red-600">{statusCounts.Overdue}</span>
              </span>
            )}
          </div>

          {/* Search */}
          <input
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by project or member…"
            className="input mb-3"
          />

          {/* Filter chips + sort */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1.5">
              <StatusFilterChips activeStatuses={activeStatuses} onToggle={toggleStatus} />
              {statusCounts.Overdue > 0 && (
                <button
                  onClick={() => setFilterOverdue(v => !v)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    filterOverdue ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                  }`}
                >
                  Overdue
                </button>
              )}
              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="rounded-full px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <label className="text-xs text-gray-400">Sort by</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {total === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <p className="text-lg">No projects yet.</p>
          <p className="mt-1 text-sm">Click &ldquo;Add Project&rdquo; to get started.</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <p className="text-lg">No projects match the current filters.</p>
          <button onClick={clearFilters} className="mt-2 text-sm text-blue-500 hover:text-blue-700">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayed.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}
    </div>
  )
}
