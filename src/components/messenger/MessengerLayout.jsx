import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import PinnedMessages from './PinnedMessages'
import { useMessengerController } from '../../hooks/messenger/useMessengerController'
import ModalHeader from '../ui/ModalHeader'
import Avatar from '../ui/Avatar'
import { useStore } from '../../stores/StoreContext'
import { useProfileModal } from '../../contexts/ProfileModalContext'
import { searchMessagesInChat } from '../../services/searchService'
import useMessageLoader from '../../hooks/useMessageLoader'

const MessengerLayout = observer(({ selectedChat }) => {
  const ctrl = useMessengerController(selectedChat)
  const { chat, messages } = useStore()
  const navigate = useNavigate()
  const { openProfileModal } = useProfileModal()
  const [attachmentsOpen, setAttachmentsOpen] = useState(false)
  const [muteOpen, setMuteOpen] = useState(false)
  const [muteValue, setMuteValue] = useState('1h')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const attContainerRef = useRef(null)
  const muteContainerRef = useRef(null)
  const messageListRef = useRef(null)
  const scrollStateRef = useRef({ topMessageId: null });
  const isNewDialog = !selectedChat
  const isLoadingRoom = chat.loadingChatId
  const chatId = selectedChat ? (selectedChat.chat_id || selectedChat.id) : null

  const loadMoreWrapper = useCallback(async () => {
    const container = messageListRef.current;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const messagesInDom = container.querySelectorAll('.message-item[id]');
      let topVisibleMessageId = null;

      // Because of `flex-direction: column-reverse`, the DOM order is opposite to the visual order.
      // We iterate from the end of the NodeList (visual top) to the start (visual bottom).
      for (let i = messagesInDom.length - 1; i >= 0; i--) {
        const messageNode = messagesInDom[i];
        const messageRect = messageNode.getBoundingClientRect();

        // Check if the message item is visible within the container's viewport.
        const isVisible = messageRect.top <= containerRect.bottom && messageRect.bottom >= containerRect.top;

        if (isVisible) {
          // The first visible message from the top is our anchor.
          topVisibleMessageId = messageNode.id;
          break;
        }
      }
      scrollStateRef.current.topMessageId = topVisibleMessageId;
    }
    await ctrl.loadMoreMessages();
  }, [ctrl]);

  useMessageLoader({
    scrollContainerRef: messageListRef,
    loadMore: loadMoreWrapper,
    hasMore: ctrl.hasMoreMessages,
    loading: ctrl.loading || ctrl.loadingMore,
    messageCount: messages.items.length,
    chatId: chatId,
  });

  useLayoutEffect(() => {
    if (scrollStateRef.current.topMessageId && !ctrl.loadingMore) {
      const { topMessageId } = scrollStateRef.current;
      const element = document.getElementById(topMessageId);
      if (element) {
        element.scrollIntoView();
      }
      scrollStateRef.current.topMessageId = null;
    }
  }, [messages.items.length, ctrl.loadingMore]);

  const handleSearchChange = async (query) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await searchMessagesInChat(query, selectedChat?.id, 10, 0)
      setSearchResults(response.results || [])
    } catch (error) {
      console.error('Ошибка поиска:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }


  const handleMessageClick = (chatId, messageId) => {
    // Здесь можно добавить навигацию к конкретному сообщению
    console.log('Переход к сообщению:', chatId, messageId)
    setSearchQuery('')
    setSearchResults([])
  }
  const companionId = selectedChat?.companion_id || selectedChat?.companionId || selectedChat?.id
  const hasCompanionId = !!companionId

  const handleProfileClick = () => {
    if (companionId) {
      openProfileModal(companionId)
    }
  }


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedChat) {
        navigate('/messenger')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedChat, navigate])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ctrl.showCallMenu && !e.target.closest('.chat-header-action-wrapper')) {
        ctrl.setShowCallMenu(false)
      }
      if (ctrl.showMoreMenu && !e.target.closest('.chat-header-action-wrapper')) {
        ctrl.setShowMoreMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ctrl])

  return (
    <div className="messenger-main">
      <div className="chat-header" style={{ display: 'flex', alignItems: 'center', borderBottom: selectedChat ? undefined : 'none' }}>
        {selectedChat && (
          <div 
            onClick={hasCompanionId ? handleProfileClick : undefined}
            style={{ cursor: hasCompanionId ? 'pointer' : 'default' }}
            title={hasCompanionId ? "Открыть профиль" : undefined}
          >
            <Avatar
              avatarUrl={selectedChat?.companion_avatar_url}
              size={56}
              alt="Аватар"
              className="chat-user-avatar"
            />
          </div>
        )}
        <div className="chat-user-info" style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, marginLeft: selectedChat ? '16px' : '0' }}>
          <div className="chat-user-name-row" style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <div 
              className="chat-user-name" 
              style={{ marginRight: 16, cursor: hasCompanionId ? 'pointer' : 'default' }}
              onClick={hasCompanionId ? handleProfileClick : undefined}
              title={hasCompanionId ? "Открыть профиль" : undefined}
            >
              {selectedChat ? (selectedChat?.title || selectedChat?.companion_login) : ''}
              {isLoadingRoom && (
                <span style={{ marginLeft: 8, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Подключение...
                </span>
              )}
            </div>
          </div>
        </div>
        {selectedChat && (
          <div className="chat-header-actions" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="chat-search-simple">
              <input
                type="text"
                className="chat-search-input-simple"
                placeholder="Поиск в чате..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
              />
              {searchResults.length > 0 && (
                <div className="chat-search-results-dropdown">
                  {searchResults.slice(0, 5).map((result, index) => (
                    <div 
                      key={index}
                      className="chat-search-result-item"
                      onMouseDown={(e) => e.preventDefault()} // Предотвращаем blur при клике
                      onClick={() => handleMessageClick(result.message.chat_id, result.message.id)}
                    >
                      <div className="chat-search-result-text">
                        {result.message.text}
                      </div>
                      <div className="chat-search-result-time">
                        {new Date(result.message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="chat-header-action-wrapper" style={{ position: 'relative' }}>
              <button 
                type="button" 
                className="chat-header-action-btn" 
                tabIndex={-1} 
                title="Позвонить"
                onClick={() => ctrl.setShowCallMenu(!ctrl.showCallMenu)}
              >
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
            <div className="chat-header-action-wrapper" style={{ position: 'relative' }}>
              <button 
                type="button" 
                className="chat-header-action-btn" 
                tabIndex={-1} 
                title="Ещё"
                onClick={() => ctrl.setShowMoreMenu(!ctrl.showMoreMenu)}
              >
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
        )}
      </div>
      
      {/* Закрепленные сообщения - вынесены под хедер на всю ширину */}
      {selectedChat && ctrl.getPinned().length > 0 && (
        <PinnedMessages 
          pinnedMessages={ctrl.getPinned()}
          onUnpin={ctrl.unpinById}
          onMessageClick={(message) => {
            // Прокрутка к сообщению
            const messageElement = document.getElementById(message.id)
            if (messageElement) {
              messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
              // Подсветка сообщения
              messageElement.classList.add('highlighted')
              setTimeout(() => {
                messageElement.classList.remove('highlighted')
              }, 2000)
            }
          }}
        />
      )}
      
      {attachmentsOpen && (
        <div className="custom-modal-backdrop" onClick={() => setAttachmentsOpen(false)}>
          <div className="custom-modal-wrapper" ref={attContainerRef} onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal" style={{ maxWidth: 520 }}>
              <ModalHeader title="Вложения" onClose={() => setAttachmentsOpen(false)} />
              <div className="custom-modal-content">
                <p>Здесь будут отображаться вложения.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="messages-container" style={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {isLoadingRoom ? (
          <div className="messages-list-empty">
            <h3>Подключение к чату...</h3>
            <p>Ожидание ответа от сервера</p>
            {searchLoading && <p>Поиск...</p>}
          </div>
        ) : isNewDialog && ctrl.messages.items.length === 0 ? (
          <div className="messages-list-empty">
          </div>
        ) : (
          <MessageList 
            ref={messageListRef}
            messages={ctrl.messages.items || []} 
            username={selectedChat?.title || selectedChat?.companion_login || 'Новый диалог'}
            onDeleteAt={ctrl.handleDeleteAt}
            onDeleteById={ctrl.handleDeleteById}
            onEditById={ctrl.handleEditById}
            onReply={ctrl.handleReply}
            onPin={ctrl.openPinModal}
          />
        )}
      </div>
      {ctrl.forwardModalOpen && (
        <div className="custom-modal-backdrop" onClick={() => ctrl.setForwardModalOpen(false)}>
          <div className="custom-modal-wrapper" ref={attContainerRef} onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal" style={{ maxWidth: 420 }}>
              <ModalHeader title="Переслать в чат" onClose={() => ctrl.setForwardModalOpen(false)} />
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


      {ctrl.pinnedListOpen && (
        <div className="custom-modal-backdrop" onClick={() => ctrl.setPinnedListOpen(false)}>
          <div className="custom-modal-wrapper" onClick={(e) => e.stopPropagation()} ref={attContainerRef}>
            <div className="custom-modal" style={{ maxWidth: 520 }}>
              <ModalHeader title="Закреплённые" onClose={() => ctrl.setPinnedListOpen(false)} />
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
      {selectedChat && (
        <>
          <div className="chat-divider" />
          <MessageInput 
            onSend={ctrl.handleSend} 
            replyTo={ctrl.replyingTo} 
            onCancelReply={ctrl.handleCancelReply}
            disabled={isLoadingRoom}
          />
        </>
      )}
    </div>
  )
})

export default MessengerLayout
