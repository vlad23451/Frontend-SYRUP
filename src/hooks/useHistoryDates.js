import { useMemo } from 'react'
import { formatHistoryDateTime } from '../utils/dateUtils'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

export const useHistoryDates = (history) => {
  const dates = useMemo(() => {
    const publishedAtStr = formatHistoryDateTime(history.created_at, userTimezone)
    const hasUpdate = Boolean(history.updated_at)
    const updatedAtStr = hasUpdate ? formatHistoryDateTime(history.updated_at, userTimezone) : null

    return {
      publishedAtStr,
      updatedAtStr,
      hasUpdate
    }
  }, [history.created_at, history.updated_at])

  return dates
}
