import React, { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { useMessengerController } from '../../hooks/messenger/useMessengerController'
import { useDraggableModal } from '../../hooks/useDraggableModal'
import ModalHeader from '../ui/ModalHeader'
import Avatar from '../ui/Avatar'

const MessengerLayout = observer(({ selectedChat }) => {
  const ctrl = useMessengerController(selectedChat)
  const [attachmentsOpen, setAttachmentsOpen] = useState(false)
  const [muteOpen, setMuteOpen] = useState(false)
  const [muteValue, setMuteValue] = useState('1h')

  const attContainerRef = useRef(null)
  const attHandleRef = useRef(null)
  useDraggableModal(attachmentsOpen, attContainerRef, attHandleRef)

  const muteContainerRef = useRef(null)
  const muteHandleRef = useRef(null)
  useDraggableModal(muteOpen, muteContainerRef, muteHandleRef)

  const isNewDialog = !selectedChat

  const defaultAvatar = (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="32" fill="#e0e0e0"/>
      <path d="M32 34c6.627 0 12-5.373 12-12S38.627 10 32 10 20 15.373 20 22s5.373 12 12 12zm0 4c-8.837 0-16 4.03-16 9v3h32v-3c0-4.97-7.163-9-16-9z" fill="#bdbdbd"/>
    </svg>
  )

  return (
    <div className="messenger-main">
      <div className="chat-header" style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          avatarKey={selectedChat?.companion_avatar_key}
          userId={selectedChat?.companion_id}
          isMyAvatar={false}
          size={56}
          alt="Аватар"
          className="chat-user-avatar"
        />
        <div className="chat-user-info" style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <div className="chat-user-name-row" style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <div className="chat-user-name" style={{ marginRight: 16 }}>{selectedChat?.companion_login || 'Новый диалог'}</div>
            <div className="chat-user-status online">{isNewDialog ? '-' : 'в сети'}</div>
          </div>
        </div>
        <div className="chat-header-actions" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="chat-header-action-wrapper" onMouseEnter={() => ctrl.setShowCallMenu(true)} onMouseLeave={() => ctrl.setShowCallMenu(false)}>
            <button type="button" className="chat-header-action-btn" tabIndex={-1} title="Позвонить">
              <span className="chat-menu-ico" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0 1 22 16.92z"/></svg>
              </span>
            </button>
            {ctrl.showCallMenu && (
              <div className="chat-header-dropdown chat-header-dropdown-down">
                <div className="chat-header-dropdown-item"><span className="chat-menu-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></span>Аудиозвонок</div>
                <div className="chat-header-dropdown-item"><span className="chat-menu-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V3"/></svg></span>Видеозвонок</div>
              </div>
            )}
          </div>
          <button type="button" className="chat-header-action-btn" tabIndex={-1} title="Поиск по чату">
            <span className="chat-menu-ico" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
          </button>
          <div className="chat-header-action-wrapper" style={{ position: 'relative' }} onMouseEnter={() => ctrl.setShowMoreMenu(true)} onMouseLeave={() => ctrl.setShowMoreMenu(false)}>
            <button type="button" className="chat-header-action-btn" tabIndex={-1} title="Ещё">
              <span className="chat-menu-ico" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
              </span>
            </button>
            {ctrl.showMoreMenu && (
                <div className="chat-header-dropdown chat-header-dropdown-down">
                <div className="chat-header-dropdown-item"><span className="chat-menu-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5"/><path d="M5 7l5 5v4l4-4 5-5z"/></svg></span>Закрепить чат</div>
                <div className="chat-header-dropdown-item" onClick={() => { setAttachmentsOpen(true); ctrl.setShowMoreMenu(false) }}><span className="chat-menu-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 8h10"/></svg></span>Показать вложения</div>
                <div className="chat-header-dropdown-item"><span className="chat-menu-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Отметить непрочитанным</div>
                <div className="chat-header-dropdown-divider" />
                <div className="chat-header-dropdown-item chat-header-dropdown-danger" onClick={() => { setMuteOpen(true); ctrl.setShowMoreMenu(false) }}><span className="chat-menu-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg></span>Отключить уведомления</div>
                <div className="chat-header-dropdown-item chat-header-dropdown-danger"><span className="chat-menu-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg></span>Архивировать чат</div>
                <div className="chat-header-dropdown-item chat-header-dropdown-danger"><span className="chat-menu-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></span>Очистить историю</div>
                <div className="chat-header-dropdown-item chat-header-dropdown-danger" style={{ color: '#dc3545' }}><span className="chat-menu-ico" style={{ color: '#dc3545' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg></span>Заблокировать</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="messages-container">
        {isNewDialog && ctrl.messages.items.length === 0 ? (
          <div className="messages-list-empty">
            <h3>Новый диалог</h3>
            <p>Напишите первое сообщение, чтобы начать переписку</p>
          </div>
        ) : (
          <>
            {ctrl.selectedIndices.length > 0 && (
          <div className="bulk-actions">
            <span className="bulk-count">Выбрано: {ctrl.selectedIndices.length}</span>
            <button className="bulk-btn" onClick={ctrl.bulkForward} title="Переслать">Переслать</button>
            <button className="bulk-btn" onClick={() => ctrl.setPinnedListOpen(true)} title="Закреплённые">Закреплённые</button>
            <button className="bulk-btn danger" onClick={ctrl.bulkDelete} title="Удалить">Удалить</button>
            <button className="bulk-btn" onClick={ctrl.clearSelection} title="Снять выделение">Снять</button>
          </div>
            )}
            <MessageList 
              messages={ctrl.messages.items || []} 
              username={selectedChat?.companion_login || 'Новый диалог'}
              onDeleteAt={ctrl.handleDeleteAt}
              onReply={ctrl.handleReply}
              onSelectToggle={ctrl.toggleSelect}
              selectedIndices={ctrl.selectedIndices}
              onPin={ctrl.openPinModal}
            />
          </>
        )}
      </div>
      {ctrl.forwardModalOpen && (
        <div className="custom-modal-backdrop" onClick={() => ctrl.setForwardModalOpen(false)}>
          <div className="custom-modal-wrapper" ref={attContainerRef} onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal" style={{ maxWidth: 420 }}>
              <ModalHeader title="Переслать в чат" onClose={() => ctrl.setForwardModalOpen(false)} />
              <div ref={attHandleRef} className="modal-drag-handle" aria-hidden />
              <div className="modal-drag-visible" aria-hidden />
              <div className="custom-modal-content">
                <p style={{ marginTop: 0, color: 'var(--color-text-secondary)' }}>Выберите чат для пересылки.</p>
                <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
                  <button className="custom-modal-btn" onClick={() => ctrl.setForwardModalOpen(false)}>Чат A</button>
                  <button className="custom-modal-btn" onClick={() => ctrl.setForwardModalOpen(false)}>Чат B</button>
                  <button className="custom-modal-btn" onClick={() => ctrl.setForwardModalOpen(false)}>Чат C</button>
                </div>
              </div>
              <div className="custom-modal-actions center no-divider">
                <button className="custom-modal-btn" onClick={() => ctrl.setForwardModalOpen(false)}>Закрыть</button>
              </div>  
            </div>
          </div>
        </div>
      )}

      {muteOpen && (
        <div className="custom-modal-backdrop" onClick={() => setMuteOpen(false)}>
          <div className="custom-modal-wrapper" ref={muteContainerRef} onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal" style={{ maxWidth: 420 }}>
              <ModalHeader title="Отключить уведомления" onClose={() => setMuteOpen(false)} />
              <div ref={muteHandleRef} className="modal-drag-handle" aria-hidden />
              <div className="modal-drag-visible" aria-hidden />
              <div className="custom-modal-content">
                <p style={{ marginTop: 0, color: 'var(--color-text-secondary)' }}>Выберите срок отключения уведомлений:</p>
                <select className="form-input" value={muteValue} onChange={(e) => setMuteValue(e.target.value)}>
                  <option value="1h">На 1 час</option>
                  <option value="3h">На 3 часа</option>
                  <option value="8h">На 8 часов</option>
                  <option value="1d">На 1 день</option>
                  <option value="until">До включения вручную</option>
                </select>
              </div>
              <div className="custom-modal-actions center">
                <button className="custom-modal-btn" onClick={() => setMuteOpen(false)}>Применить</button>
                <button className="custom-modal-btn" onClick={() => setMuteOpen(false)}>Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {ctrl.pinModalOpen && (
        <div className="custom-modal-backdrop" onClick={() => ctrl.setPinModalOpen(false)}>
          <div className="custom-modal-wrapper" ref={muteContainerRef} onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal" style={{ maxWidth: 420 }}>
              <ModalHeader title="Закрепить сообщение" onClose={() => ctrl.setPinModalOpen(false)} />
              <div ref={muteHandleRef} className="modal-drag-handle" aria-hidden />
              <div className="modal-drag-visible" aria-hidden />
              <div className="custom-modal-content">
                <p style={{ marginTop: 0, color: 'var(--color-text-secondary)' }}>Для кого выполнить закрепление?</p>
              </div>
              <div className="custom-modal-actions center">
                <button className="custom-modal-btn" onClick={() => ctrl.pinForScope('me')}>Для меня</button>
                <button className="custom-modal-btn" onClick={() => ctrl.pinForScope('all')}>Для всех</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {ctrl.pinnedListOpen && (
        <div className="custom-modal-backdrop" onClick={() => ctrl.setPinnedListOpen(false)}>
          <div className="custom-modal-wrapper" onClick={(e) => e.stopPropagation()} ref={attContainerRef}>
            <div className="custom-modal" style={{ maxWidth: 520 }}>
              <ModalHeader title="Закреплённые" onClose={() => ctrl.setPinnedListOpen(false)} />
              <div ref={attHandleRef} className="modal-drag-handle" aria-hidden />
              <div className="modal-drag-visible" aria-hidden />
              <div className="custom-modal-content" style={{ marginBottom: 0 }}>
                {ctrl.getPinned().length === 0 ? (
                  <div style={{ color: 'var(--color-text-secondary)' }}>Нет закреплённых сообщений</div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
                    {ctrl.getPinned().map((p) => (
                      <div key={p.id} style={{ border: '1px solid var(--color-border)', borderRadius: 10, padding: '10px 12px', background:'var(--color-bg)' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap: 8 }}>
                          <div style={{ fontSize: 12, color:'var(--color-text-secondary)' }}>{p.scope === 'all' ? 'Для всех' : 'Для меня'}</div>
                          <button className="custom-modal-btn" onClick={() => ctrl.unpinById(p.id)}>Открепить</button>
                        </div>
                        <div style={{ fontWeight: 600, marginTop: 4 }}>{p.message.user}</div>
                        <div style={{ color:'var(--color-text-secondary)' }}>{(p.message.text || '').slice(0, 200)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="custom-modal-actions center no-divider">
                <button className="custom-modal-btn" onClick={() => ctrl.setPinnedListOpen(false)}>Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="chat-divider" />
      <MessageInput onSend={ctrl.handleSend} replyTo={ctrl.replyingTo} onCancelReply={ctrl.handleCancelReply} />
    </div>
  )
})

export default MessengerLayout
