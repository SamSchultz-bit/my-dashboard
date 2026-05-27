import { useMemo, useState } from 'react'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectForm } from '../components/ProjectForm'

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

const SORT_OPTIONS = [
  { value: 'due',    label: 'Due Date' },
  { value: 'name',   label: 'Name (A → Z)' },
  { value: 'name-z', label: 'Name (Z → A)' },
  { value: 'status', label: 'Status' },
  { value: 'member', label: 'Member' },
  { value: 'type',   label: 'Project Type' },
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function applyFiltersAndSort(projects, activeStatuses, sortBy) {
  let result = activeStatuses.length > 0
    ? projects.filter(p => activeStatuses.includes(p.status))
    : projects

  return [...result].sort((a, b) => {
    switch (sortBy) {
      case 'due': {
        // Projects with no due date sort to the end
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
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
  const [sortBy, setSortBy] = useState('due')

  const displayed = useMemo(
    () => applyFiltersAndSort(projects, activeStatuses, sortBy),
    [projects, activeStatuses, sortBy]
  )

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

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {showing === total
              ? `${total} ${total === 1 ? 'project' : 'projects'}`
              : `${showing} of ${total} projects`}
          </p>
        </div>
        <button onClick={() => setFormOpen(true)} className="btn-primary">
          + Add Project
        </button>
      </div>

      {total > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map(status => {
              const active = activeStatuses.includes(status)
              const style = active ? STATUS_ACTIVE_STYLES[status] : STATUS_STYLES[status]
              return (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${style}`}
                >
                  {status}
                </button>
              )
            })}
            {activeStatuses.length > 0 && (
              <button
                onClick={() => setActiveStatuses([])}
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
      )}

      {total === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <p className="text-lg">No projects yet.</p>
          <p className="mt-1 text-sm">Click &ldquo;Add Project&rdquo; to get started.</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <p className="text-lg">No projects match the selected filters.</p>
          <button onClick={() => setActiveStatuses([])} className="mt-2 text-sm text-blue-500 hover:text-blue-700">
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
