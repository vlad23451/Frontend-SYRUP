const ConfirmModal = ({ open, message, onConfirm, onCancel, confirmText = 'Подтвердить', cancelText = 'Отмена' }) => {
  if (!open) return null

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal-wrapper">
        <div className="custom-modal confirm-modal">
          <div className="custom-modal-header">
            <h3 className="custom-modal-title">Подтверждение</h3>
          </div>
          <div className="custom-modal-content">
            <p>{message}</p>
          </div>
          <div className="custom-modal-actions">
            <button className="custom-modal-btn cancel" onClick={onCancel}>
              {cancelText}
            </button>
            <button className="custom-modal-btn danger" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
