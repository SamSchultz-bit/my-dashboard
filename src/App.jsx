import { useEffect, useRef, useState } from 'react'
import { supabase } from './lib/supabase'
import { LoginForm } from './components/LoginForm'
import { ProjectTracker } from './pages/ProjectTracker'
import { NextStepsList } from './components/NextStepsList'
import { WaitingOnList } from './components/WaitingOnList'
import { useProjects } from './hooks/useProjects'

function exportProjects(projects) {
  const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `my-dashboard-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function App() {
  // undefined = checking auth, null = not signed in, object = signed in
  const [user, setUser] = useState(undefined)
  const { projects, setProjects, loading } = useProjects(user?.id)
  const importRef = useRef(null)
  const migratedRef = useRef(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // One-time migration: if localStorage has projects and Supabase has none, offer to import
  useEffect(() => {
    if (migratedRef.current || loading || !user || projects.length > 0) return
    migratedRef.current = true
    const stored = localStorage.getItem('projects')
    if (!stored) return
    try {
      const local = JSON.parse(stored)
      if (!Array.isArray(local) || local.length === 0) return
      if (window.confirm(`Found ${local.length} project${local.length !== 1 ? 's' : ''} saved in this browser. Import them to the cloud?`)) {
        setProjects(local)
        localStorage.removeItem('projects')
      }
    } catch {
      // invalid JSON — ignore
    }
  }, [loading, user, projects.length, setProjects])

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result)
        if (!Array.isArray(data)) throw new Error()
        const msg = `This will replace your ${projects.length} current project${projects.length !== 1 ? 's' : ''} with ${data.length} imported. Continue?`
        if (!window.confirm(msg)) return
        setProjects(data)
      } catch {
        alert("Couldn't read that file. Make sure it's a valid dashboard export.")
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  if (user === undefined || (user && loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <span className="text-sm text-gray-400">Loading…</span>
      </div>
    )
  }

  if (!user) return <LoginForm />

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b-2 border-indigo-500 bg-slate-900 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-semibold text-white">My Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => exportProjects(projects)}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              Export
            </button>
            <button
              onClick={() => importRef.current?.click()}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              Import
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-slate-400 transition-colors hover:text-slate-200"
            >
              Sign out
            </button>
            <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">
        <div className="flex items-start gap-6">
          <div className="min-w-0 flex-1">
            <ProjectTracker projects={projects} setProjects={setProjects} />
          </div>
          <div className="sticky top-6 flex max-h-[calc(100vh-3rem)] w-80 shrink-0 flex-col gap-4 overflow-y-auto">
            <NextStepsList projects={projects} setProjects={setProjects} />
            <WaitingOnList projects={projects} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
