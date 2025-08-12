import React from 'react'

const ChatSidebar = () => {
  return (
    <div className="messenger-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Контакты</h3>
        <p className="sidebar-subtitle">Выберите пользователя для чата</p>
      </div>
      <div className="contacts-list">
        <div className="contact-item active">
          <div className="contact-avatar">U</div>
          <div className="contact-info">
            <div className="contact-name">Общий чат</div>
            <div className="contact-status online">Онлайн</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar 
