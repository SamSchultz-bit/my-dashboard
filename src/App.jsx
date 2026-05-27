import { useEffect } from 'react'
import { ProjectTracker } from './pages/ProjectTracker'
import { NextStepsList } from './components/NextStepsList'
import { WaitingOnList } from './components/WaitingOnList'
import { useLocalStorage } from './hooks/useLocalStorage'
import { DEMO_PROJECTS } from './utils/demoData'

function App() {
  const [projects, setProjects] = useLocalStorage('projects', DEMO_PROJECTS)
  const [hasSeeded, setHasSeeded] = useLocalStorage('hasSeeded', false)

  useEffect(() => {
    localStorage.removeItem('checkedSteps')
    if (!hasSeeded && projects.length === 0) {
      setProjects(DEMO_PROJECTS)
      setHasSeeded(true)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b-2 border-indigo-500 bg-slate-900 px-6 py-4">
        <h1 className="text-xl font-semibold text-white">My Dashboard</h1>
      </header>
      <main className="mx-auto max-w-7xl p-6">
        <div className="flex items-start gap-6">
          <div className="min-w-0 flex-1">
            <ProjectTracker projects={projects} setProjects={setProjects} />
          </div>
          <div className="flex w-80 shrink-0 flex-col gap-4 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <NextStepsList projects={projects} setProjects={setProjects} />
            <WaitingOnList projects={projects} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
