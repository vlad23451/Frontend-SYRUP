import React from 'react'

const CreateHistoryButton = ({ onClick }) => {
  return (
    <div className="create-history-section">
      <button 
        className="create-history-btn subtle"
        onClick={onClick}
      >
        <span className="create-history-ico" aria-hidden>✏️</span>
        <span>Создать новую историю</span>
      </button>
    </div>
  )
}

export default CreateHistoryButton 
