import React, { useRef, useEffect } from 'react'
import MessageItem from './MessageItem'
import { formatMessageDateParts } from '../../utils/dateUtils'

const MessageList = ({ messages, username, onDeleteAt, onDeleteById, onEditById, onReply, onSelectToggle, selectedIndices = [] }) => {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const groups = (() => {
    const map = new Map()
    const messagesArray = Array.isArray(messages) ? messages : []
    for (const m of messagesArray) { 
      const key = formatMessageDateParts(m.timestamp).label
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(m)
    }
    return Array.from(map.entries())
  })()

  return (
    <div className="messages-list">
      {groups.length === 0 && (
        <div className="messages-list-empty">
          <p>Нет сообщений</p>
          <p>Начните общение прямо сейчас!</p>
        </div>
      )}
      {groups.map(([label, msgs]) => (
        <React.Fragment key={label}>
          <div className="messages-date-separator">{label}</div>
          {msgs.map((msg, idx) => (
            <MessageItem
              key={`${label}-${idx}`}
              index={idx}
              message={msg}
              isOwn={msg.from_me}
              onReply={(_, m) => { onReply?.(m) }}
              onCopy={() => { try { navigator.clipboard.writeText(msg.text || '') } catch {} }}
              onEdit={() => { /* TODO: открыть инлайн-редактор */ }}
              onEditById={onEditById}
              onDelete={() => { onDeleteAt?.(idx) }}
              onDeleteById={onDeleteById}
              onSelect={() => onSelectToggle?.(idx)}
              selected={selectedIndices.includes(idx)}
              onPin={(_, m) => onSelectToggle?.(idx)}
            />
          ))}
        </React.Fragment>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
