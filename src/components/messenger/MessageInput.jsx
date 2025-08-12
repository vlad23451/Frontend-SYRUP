import React, { useState } from 'react'

const MessageInput = ({ onSend, replyTo, onCancelReply }) => {
  const [input, setInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() || selectedFile) {
      onSend(input, selectedFile)
      setInput('')
      setSelectedFile(null)
    }
  }

  const handleFileSelect = (e) => {
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
          >
            ×
          </button>
        </div>
      )}
      <div className="message-input-container">
        <label className="attach-file-btn">
          <input
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          📎
        </label>
        <input
          type="text"
          className="message-input"
          placeholder="Введите сообщение..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="send-btn">
          ➤
        </button>
      </div>
    </form>
  )
}

export default MessageInput 
