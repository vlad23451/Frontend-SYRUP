import React from 'react'
import CreateHistoryButton from '../histories/CreateHistoryButton'

const UserHistoriesHeader = ({ onOpenModal, historiesCount = 0 }) => {
  return (
    <div className="user-histories-header">
      <h3 className="text-primary">Мои истории - {historiesCount}</h3>
      <CreateHistoryButton onClick={onOpenModal} />
    </div>
  )
}

export default UserHistoriesHeader 
