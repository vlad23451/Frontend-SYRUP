import React from 'react'

const UserHistoriesEmpty = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="80" height="80" rx="12" fill="#f0f0f0"/>
          <rect x="20" y="20" width="40" height="25" rx="4" fill="#e0e0e0"/>
          <rect x="20" y="50" width="30" height="4" rx="2" fill="#e0e0e0"/>
          <rect x="20" y="58" width="20" height="4" rx="2" fill="#e0e0e0"/>
          <rect x="20" y="66" width="15" height="4" rx="2" fill="#e0e0e0"/>
        </svg>
      </div>
      <h4 className="empty-state-title">Нет историй</h4>
      <p className="empty-state-text">Ты пока что не опубликовал(а) ни одной истории...</p>
    </div>
  )
}

export default UserHistoriesEmpty
