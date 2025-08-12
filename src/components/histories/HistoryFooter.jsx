import React from 'react'
import { formatDateTime } from '../../utils/dateUtils'

const HistoryFooter = ({ history }) => {
  const updated = formatDateTime(history.updated_at)

  if (!history.updated_at || history.created_at === history.updated_at) {
    return null
  }

  return (
    <div className="history-meta">
      <div className="history-date">
        <span>✏️ Изменено: {updated.date} в {updated.time}</span>
      </div>
    </div>
  )
}

export default HistoryFooter 
