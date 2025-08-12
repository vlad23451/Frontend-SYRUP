import React from 'react'

const ModalHeader = ({ title, onClose, disabled, hideClose }) => {
  return (
    <div className="custom-modal-header">
      <h3 className="custom-modal-title">{title}</h3>
      {!hideClose && (
        <button 
          className="custom-modal-close" 
          onClick={onClose}
          disabled={disabled}
          aria-label="Закрыть"
          title="Закрыть"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default ModalHeader 
