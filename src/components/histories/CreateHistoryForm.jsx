import React, { useRef, useState } from 'react'

const CreateHistoryForm = ({ formData, loading, error, handleChange, handleSubmit }) => {
  const [attachOpen, setAttachOpen] = useState(false)
  const photoVideoInputRef = useRef(null)
  const audioInputRef = useRef(null)
  const docsInputRef = useRef(null)
  const otherInputRef = useRef(null)

  const openPicker = (ref) => {
    setAttachOpen(false)
    if (ref && ref.current) {
      ref.current.click()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label required">Заголовок:</label>
        <input
          type="text"
          name="title"
          className="form-input"
          value={formData.title}
          onChange={handleChange}
          placeholder="Введите заголовок истории"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Описание:</label>
        <textarea
          name="description"
          className="form-input form-textarea no-resize xl"
          value={formData.description}
          onChange={handleChange}
          placeholder="Введите описание истории"
          rows="8"
          disabled={loading}
        />
      </div>

      <div className="form-attach-row">
        <div className="form-attach-bar">
          <button
            type="button"
            className="attach-trigger"
            aria-haspopup="true"
            aria-expanded={attachOpen}
            onClick={() => setAttachOpen((v) => !v)}
            disabled={loading}
            title="Прикрепить"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21.44 11.05L12 20.49a6 6 0 1 1-8.49-8.49l9.19-9.19a4 4 0 1 1 5.66 5.66l-9.19 9.19a2 2 0 1 1-2.83-2.83l8.49-8.49"/>
            </svg>
          </button>
          {attachOpen && (
            <div className="attach-menu" role="menu">
              <button type="button" className="attach-item" onClick={() => openPicker(photoVideoInputRef)} role="menuitem">
                <span className="attach-ico">📷</span>
                Фото/Видео
              </button>
              <button type="button" className="attach-item" onClick={() => openPicker(audioInputRef)} role="menuitem">
                <span className="attach-ico">🎵</span>
                Аудио
              </button>
              <button type="button" className="attach-item" onClick={() => openPicker(docsInputRef)} role="menuitem">
                <span className="attach-ico">📄</span>
                Документы
              </button>
              <button type="button" className="attach-item" onClick={() => openPicker(otherInputRef)} role="menuitem">
                <span className="attach-ico">📦</span>
                Другое
              </button>
            </div>
          )}
          {/* Hidden inputs with filters */}
          <input ref={photoVideoInputRef} type="file" name="attachments" className="hidden-file-input" onChange={handleChange} multiple accept="image/*,video/*" tabIndex={-1} />
          <input ref={audioInputRef} type="file" name="attachments" className="hidden-file-input" onChange={handleChange} multiple accept="audio/*" tabIndex={-1} />
          <input ref={docsInputRef} type="file" name="attachments" className="hidden-file-input" onChange={handleChange} multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" tabIndex={-1} />
          <input ref={otherInputRef} type="file" name="attachments" className="hidden-file-input" onChange={handleChange} multiple accept=".zip,.rar,.7z" tabIndex={-1} />
        </div>
      </div>

      {/* hint removed per request */}
    </form>
  )
}

export default CreateHistoryForm 
