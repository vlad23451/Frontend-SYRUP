import React from 'react'
import MessageItem from './MessageItem'
import { formatMessageDateParts } from '../../utils/dateUtils'

const MessageList = React.forwardRef(({ messages, username, onDeleteAt, onDeleteById, onEditById, onReply, onPin, onSelectToggle, selectedIndices = [] }, ref) => {

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
    <div 
      ref={ref}
      className="messages-list" 
      style={{ 
        display: 'flex',
        flexDirection: 'column-reverse',
        height: '100%',
        overflowY: 'auto',
        paddingRight: '5px' // Смещаем скроллбар вправо
      }}
    >
      {groups.length === 0 && (
        <div className="messages-list-empty">
          <p>Нет сообщений</p>
          <p>Начните общение прямо сейчас!</p>
        </div>
      )}
      {/* Разворачиваем группы и сообщения для корректного отображения снизу вверх */}
      {[...groups].reverse().map(([label, msgs]) => (
        <React.Fragment key={label}>
          {/* Разворачиваем сообщения в группе */}
          {[...msgs].reverse().map((msg, idx) => (
            <MessageItem
              key={`${label}-${msgs.length - 1 - idx}`}
              index={msgs.length - 1 - idx}
              message={msg}
              isOwn={msg.from_me}
              onReply={(_, m) => { onReply?.(m) }}
              onCopy={() => { try { navigator.clipboard.writeText(msg.text || '') } catch {} }}
              onEdit={() => { /* TODO: открыть инлайн-редактор */ }}
              onEditById={onEditById}
              onDelete={() => { onDeleteAt?.(msgs.length - 1 - idx) }}
              onDeleteById={onDeleteById}
              onSelect={() => onSelectToggle?.(msgs.length - 1 - idx)}
              selected={selectedIndices.includes(msgs.length - 1 - idx)}
              onPin={(_, m) => onPin?.(m)}
            />
          ))}
          <div className="messages-date-separator">{label}</div>
        </React.Fragment>
      ))}
    </div>
  )
})

export default MessageList
