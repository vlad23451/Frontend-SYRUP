import React from 'react'
import CreateHistoryButton from '../histories/CreateHistoryButton'

const UserHistoriesHeader = ({ onOpenModal }) => {
  return (
    <div className="user-histories-header">
      <h3 className="text-primary">Мои истории</h3>
      <CreateHistoryButton onClick={onOpenModal} />
    </div>
  )
}

export default UserHistoriesHeader 
