import { useState } from 'react'

const PROJECT_TYPES = [
  'Mortgage',
  'Auto Loan',
  'Personal Loan',
  'Home Equity',
  'Refinance',
  'Account Opening',
  'Business Loan',
  'Other',
]

const STATUSES = ['Not Started', 'In Progress', 'Blocked', 'Complete']

const EMPTY = {
  projectName: '',
  member: '',
  projectType: '',
  status: 'Not Started',
  dueDate: '',
  waitingOn: '',
  nextSteps: '',
}

/** @param {{ project?: object, onSave: function, onCancel: function }} props */
export function ProjectForm({ project, onSave, onCancel }) {
  const [form, setForm] = useState(project ?? EMPTY)

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
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
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

          <div className="grid grid-cols-2 gap-4">
            <Field label="Project Type">
              <select name="projectType" value={form.projectType} onChange={handleChange} className="input">
                <option value="">Select type…</option>
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
