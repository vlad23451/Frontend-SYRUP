import React from 'react'

const ChatSection = ({
  chatSort,
  setChatSort,
  confirmDelete,
  setConfirmDelete,
  autoDeleteTimer,
  setAutoDeleteTimer,
  chatAutoPlayMedia,
  setChatAutoPlayMedia,
  showSendTime,
  setShowSendTime,
  showTypingIndicator,
  setShowTypingIndicator,
  showDeliveryStatus,
  setShowDeliveryStatus,
  getPressedStyle,
}) => {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ fontWeight: 700 }}>Чаты</div>
      <div style={{ display:'grid', gap:6 }}>
        <span>Порядок отображения</span>
        {[
          {k:'date',label:'По дате'},
          {k:'name',label:'По имени'},
          {k:'unread',label:'По количеству непрочитанных'},
        ].map(({k,label}) => (
          <button
            key={k}
            className="custom-modal-btn"
            onClick={()=> setChatSort(k)}
            aria-pressed={chatSort===k}
            style={{ width:'100%', justifyContent:'center', ...getPressedStyle(chatSort===k) }}
          >
            {label}
          </button>
        ))}
      </div>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={confirmDelete} onChange={(e)=> setConfirmDelete(e.target.checked)} />
        <span>Подтверждение перед удалением сообщений</span>
      </label>
      <label style={{ display:'grid', gap:4 }}>
        <span>Автоудаление сообщений (мин)</span>
        <input type="number" min="0" max="10080" value={autoDeleteTimer} onChange={(e)=> setAutoDeleteTimer(Number(e.target.value))} />
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={chatAutoPlayMedia} onChange={(e)=> setChatAutoPlayMedia(e.target.checked)} />
        <span>Автовоспроизведение медиа</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={showSendTime} onChange={(e)=> setShowSendTime(e.target.checked)} />
        <span>Показывать время отправки</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={showTypingIndicator} onChange={(e)=> setShowTypingIndicator(e.target.checked)} />
        <span>Индикатор набора текста</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={showDeliveryStatus} onChange={(e)=> setShowDeliveryStatus(e.target.checked)} />
        <span>Статус доставки и прочтения</span>
      </label>
    </div>
  )
}

export default ChatSection


