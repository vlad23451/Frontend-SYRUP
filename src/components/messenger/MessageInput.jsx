import React, { useState } from 'react'

const MessageInput = ({ onSend, replyTo, onCancelReply, disabled = false }) => {
  const [input, setInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if ((input.trim() || selectedFile) && !disabled) {
      onSend(input, selectedFile)
      setInput('')
      setSelectedFile(null)
    } else {
    }
  }

  const handleFileSelect = (e) => {
    if (disabled) return
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="message-form">
      {replyTo && (
        <div className="reply-preview">
          <div className="reply-title">Ответ на сообщение</div>
          <div className="reply-body">
            <div className="reply-user">{replyTo.user}</div>
            <div className="reply-text">{replyTo.text?.slice(0, 160) || ''}</div>
          </div>
          <button type="button" className="reply-cancel" onClick={onCancelReply} title="Отменить">
            ×
          </button>
        </div>
      )}
      {selectedFile && (
        <div className="selected-file">
          <span>{selectedFile.name}</span>
          <button 
            type="button" 
            className="remove-file-btn"
            onClick={() => setSelectedFile(null)}
            disabled={disabled}
          >
            ×
          </button>
        </div>
      )}
      <div className="message-input-container">
        <label className={`attach-file-btn ${disabled ? 'disabled' : ''}`}>
          <input
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={disabled}
          />
          📎
        </label>
        <input
          type="text"
          className={`message-input ${disabled ? 'disabled' : ''}`}
          placeholder={disabled ? "Подключение к чату..." : "Введите сообщение..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={disabled}
        />
        <button type="submit" className={`send-btn ${disabled ? 'disabled' : ''}`} disabled={disabled}>
          ➤
        </button>
      </div>
    </form>
  )
}

export default MessageInput 
