import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

async function syncChanges(prev, next, userId) {
  const nextIds = new Set(next.map(p => p.id))
  const deletedIds = prev.filter(p => !nextIds.has(p.id)).map(p => p.id)
  if (deletedIds.length) {
    await supabase.from('projects').delete().in('id', deletedIds)
  }

  const prevMap = Object.fromEntries(prev.map(p => [p.id, p]))
  const toUpsert = next.filter(p => {
    const old = prevMap[p.id]
    return !old || JSON.stringify(old) !== JSON.stringify(p)
  })
  if (toUpsert.length) {
    await supabase
      .from('projects')
      .upsert(toUpsert.map(p => ({ id: p.id, user_id: userId, data: p })))
  }
}

/** @param {string | undefined} userId */
export function useProjects(userId) {
  const [projects, setProjectsState] = useState([])
  // Track which userId we've already fetched for; loading = not yet fetched for current user
  const [fetchedFor, setFetchedFor] = useState(null)
  const prevRef = useRef([])
  const readyRef = useRef(false)

  const loading = fetchedFor !== userId

  useEffect(() => {
    if (!userId) return
    readyRef.current = false
    prevRef.current = []

    supabase
      .from('projects')
      .select('data')
      .then(({ data, error }) => {
        if (!error) {
          const loaded = (data ?? []).map(r => r.data)
          setProjectsState(loaded)
          prevRef.current = loaded
        }
        readyRef.current = true
        setFetchedFor(userId)
      })
  }, [userId])

  const setProjects = useCallback((updater) => {
    setProjectsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (readyRef.current && userId) {
        const snapshot = prevRef.current
        prevRef.current = next
        syncChanges(snapshot, next, userId).catch(console.error)
      }
      return next
    })
  }, [userId])

  return { projects, setProjects, loading }
}
