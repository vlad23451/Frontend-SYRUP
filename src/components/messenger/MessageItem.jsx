import React, { useState, useRef, useEffect } from 'react'
import { formatMessageDateParts } from '../../utils/dateUtils'

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const MessageItem = ({ message, isOwn, index, onReply, onEdit, onDelete, onCopy, onPin, onForward, onSelect, selected }) => {
  const { text, file, time } = message
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    window.addEventListener('mousedown', onDocClick)
    return () => window.removeEventListener('mousedown', onDocClick)
  }, [menuOpen])
  return (
      <div className={`message-item ${isOwn ? 'own' : ''} ${selected ? 'selected' : ''}`} onClick={(e) => { if (selected !== undefined) onSelect?.(index, message) }}>
      <div className="message-content" style={{ position: 'relative' }}>
        {message.replyTo && (
          <div className="message-reply">
            <div className="message-reply-user">{message.replyTo.user}</div>
            <div className="message-reply-text">{(message.replyTo.text || '').slice(0, 160)}</div>
          </div>
        )}
        <div className="message-text">
          {text}
          {file && (
            <div className="message-file">
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="file-link">
                📎 {file.name}
              </a>
            </div>
          )}
        </div>
        <button
          type="button"
          className={`msg-action-dots ${menuOpen ? 'open' : ''}`}
          title="Действия"
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup
          aria-expanded={menuOpen}
        >
          •••
        </button>
        {menuOpen && (
          <div className="msg-action-menu" ref={menuRef}>
            <button className="msg-action-item" onClick={() => { setMenuOpen(false); onReply?.(index, message) }}>
              <span className="msg-action-ico" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
              </span>
              Ответить
            </button>
            {isOwn && (
              <button className="msg-action-item" onClick={() => { setMenuOpen(false); onEdit?.(index, message) }}>
                <span className="msg-action-ico" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </span>
                Изменить
              </button>
            )}
            <button className="msg-action-item" onClick={() => { setMenuOpen(false); onPin?.(index, message) }}>
              <span className="msg-action-ico" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M5 7l5 5v4l4-4 5-5z"/></svg>
              </span>
              Закрепить
            </button>
            <button className="msg-action-item" onClick={() => { setMenuOpen(false); onCopy?.(index, message) }}>
              <span className="msg-action-ico" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </span>
              Копировать текст
            </button>
            <button className="msg-action-item" onClick={() => { setMenuOpen(false); onForward?.(index, message) }}>
              <span className="msg-action-ico" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h11"/><path d="M10 6l6 6-6 6"/></svg>
              </span>
              Переслать
            </button>
            {isOwn && (
              <button className="msg-action-item danger" onClick={() => { setMenuOpen(false); onDelete?.(index, message) }}>
                <span className="msg-action-ico" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>
                </span>
                Удалить
              </button>
            )}
            <button className="msg-action-item" onClick={() => { setMenuOpen(false); onSelect?.(index, message) }}>
              <span className="msg-action-ico" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/><path d="M9 12l2 2 4-4"/></svg>
              </span>
              Выделить
            </button>
          </div>
        )}
        <div className="message-time">
          {formatMessageDateParts(time, userTimezone).time}
        </div>
      </div>
    </div>
  )
}

export default MessageItem
