import { ProjectTracker } from './pages/ProjectTracker'
import { NextStepsList } from './components/NextStepsList'
import { useLocalStorage } from './hooks/useLocalStorage'

function App() {
  const [projects, setProjects] = useLocalStorage('projects', [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">My Dashboard</h1>
      </header>
      <main className="mx-auto max-w-7xl p-6">
        <div className="flex items-start gap-6">
          <div className="min-w-0 flex-1">
            <ProjectTracker projects={projects} setProjects={setProjects} />
          </div>
          <div className="w-80 shrink-0 sticky top-6">
            <NextStepsList projects={projects} setProjects={setProjects} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
