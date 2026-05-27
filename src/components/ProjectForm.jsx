import { useEffect, useRef, useState } from 'react'
import { PROJECT_TYPES, STATUSES, PRIORITY_LEVELS } from '../utils/constants'

const EMPTY = {
  projectName: '',
  member: '',
  projectType: '',
  status: 'Not Started',
  priority: '',
  dueDate: '',
  waitingOn: '',
  nextSteps: '',
}

/** @param {{ project?: object, onSave: function, onCancel: function }} props */
export function ProjectForm({ project, onSave, onCancel }) {
  const [form, setForm] = useState(project ?? EMPTY)
  const panelRef = useRef(null)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    const focusable = panel.querySelectorAll('button, input, select, textarea')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onCancel()
        return
      }
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    panel.addEventListener('keydown', handleKeyDown)
    return () => panel.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.projectName.trim()) return
    onSave(form)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <div ref={panelRef} className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          {project ? 'Edit Project' : 'New Project'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Project Name" required>
            <input
              name="projectName"
              value={form.projectName}
              onChange={handleChange}
              placeholder="e.g. Smith Auto Loan"
              className="input"
              required
              autoFocus
            />
          </Field>

          <Field label="Member Name">
            <input
              name="member"
              value={form.member}
              onChange={handleChange}
              placeholder="e.g. Jane Smith"
              className="input"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Project Type">
              <select name="projectType" value={form.projectType} onChange={handleChange} className="input">
                <option value="">Type…</option>
                {PROJECT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>

            <Field label="Status">
              <select name="status" value={form.status} onChange={handleChange} className="input">
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Priority">
              <select name="priority" value={form.priority} onChange={handleChange} className="input">
                <option value="">None</option>
                {PRIORITY_LEVELS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Due Date">
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="input"
            />
          </Field>

          <Field label="Waiting On">
            <textarea
              name="waitingOn"
              value={form.waitingOn}
              onChange={handleChange}
              rows={2}
              placeholder="What's blocking this?"
              className="input resize-none"
            />
          </Field>

          <Field label="Next Steps">
            <textarea
              name="nextSteps"
              value={form.nextSteps}
              onChange={handleChange}
              rows={2}
              placeholder="What needs to happen next?"
              className="input resize-none"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {project ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}
