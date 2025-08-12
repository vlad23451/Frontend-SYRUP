import React from 'react'

const UserHistoriesLoading = () => {
  return (
    <div className="user-histories">
      <h3 className="text-primary mb-3">📰 Мои истории</h3>
      <div className="text-center">
        <div className="loading"></div>
        <p className="text-secondary mt-3">Загрузка историй...</p>
      </div>
    </div>
  )
}

export default UserHistoriesLoading 
