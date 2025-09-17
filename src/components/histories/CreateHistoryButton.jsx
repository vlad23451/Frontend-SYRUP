import React from 'react'

const CreateHistoryButton = ({ onClick }) => {
  
  const handleClick = (e) => {
    e.preventDefault()
    onClick()
  }
  
  return (
    <button 
      className="create-history-btn"
      onClick={handleClick}
      type="button"
    >
      <span className="create-history-ico" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </span>
      <span>Создать новую историю</span>
    </button>
  )
}

export default CreateHistoryButton 
