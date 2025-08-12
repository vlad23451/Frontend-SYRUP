import React from 'react'

const ModalFooter = ({ onCancel, onSubmit, loading, cancelText = "Отмена", submitText = "Создать историю", hideCancel, center, noDivider }) => {
  const actionsClass = `custom-modal-actions${center ? ' center' : ''}${noDivider ? ' no-divider' : ''}`
  return (
    <div className={actionsClass}>
      {!hideCancel && (
        <button 
          type="button" 
          className="custom-modal-btn cancel"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </button>
      )}
      <button 
        type="submit" 
        className="custom-modal-btn confirm"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? 'Создание...' : submitText}
      </button>
    </div>
  )
}

export default ModalFooter 
