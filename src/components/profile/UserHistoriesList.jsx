import React from 'react'
import HistoryCard from '../histories/HistoryCard'
import CustomConfirmModal from '../histories/CustomConfirmModal'
import { useState } from 'react'

const UserHistoriesList = ({ histories, onDelete, onUpdate }) => {
  const [confirmState, setConfirmState] = useState({ open: false, onConfirm: null })
  const handleConfirmRequest = ({ onConfirm }) => setConfirmState({ open: true, onConfirm })
  const handleConfirm = () => {
    if (confirmState.onConfirm) confirmState.onConfirm()
    setConfirmState({ open: false, onConfirm: null })
  }
  const handleCancel = () => setConfirmState({ open: false, onConfirm: null })
  
  return (
    <>
      <div className="histories-list">
        {histories.map((history) => (
          <HistoryCard
            key={history.id}
            history={history}
            forceMeAsAuthor
            isOwner={true}
            onDelete={() => onDelete?.(history.id)}
            onUpdate={onUpdate}
          />
        ))}
      </div>
      <CustomConfirmModal 
        open={confirmState.open}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message="Вы уверены, что хотите удалить эту историю?"
      />
    </>
  )
}

export default UserHistoriesList 
