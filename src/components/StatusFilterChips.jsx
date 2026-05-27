import { STATUSES, STATUS_STYLES, STATUS_ACTIVE_STYLES } from '../utils/constants'

/** @param {{ activeStatuses: string[], onToggle: function }} props */
export function StatusFilterChips({ activeStatuses, onToggle }) {
  return (
    <>
      {STATUSES.map(status => {
        const active = activeStatuses.includes(status)
        const style = active ? STATUS_ACTIVE_STYLES[status] : STATUS_STYLES[status]
        return (
          <button
            key={status}
            onClick={() => onToggle(status)}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${style}`}
          >
            {status}
          </button>
        )
      })}
    </>
  )
}
