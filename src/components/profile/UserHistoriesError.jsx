import React from 'react'

const UserHistoriesError = ({ error }) => {
  const errorMsg = error && error.message ? error.message : String(error)
  return (
    <div className="user-histories">
      <h3 className="text-primary mb-3">📰 Мои истории</h3>
      <div className="alert alert-danger">
        <strong>Ошибка загрузки историй:</strong> {errorMsg}
      </div>
    </div>
  )
}

export default UserHistoriesError 
