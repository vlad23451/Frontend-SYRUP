import { useEffect, useState, useCallback, useRef } from 'react'
import { useStore } from '../../stores/StoreContext'
import { getUserId } from '../../utils/localStorageUtils'
import { getLastUnreadMessageTimeFromDOM } from '../../utils/chatUtils'

export const useMessengerController = (selectedChat) => { 
  const { messages, chat, websocket } = useStore()
  const [showCallMenu, setShowCallMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [selectedIndices, setSelectedIndices] = useState([])
  const lastMarkSentRef = useRef({ chatId: null, until: null })

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      if (!selectedChat) {
        messages.clearMessages?.()
        return
      }
      
      try {
        if (selectedChat.chat_id) {
          await messages.fetchHistoryByChatId?.(selectedChat.chat_id, 0, 50)
        } else {
          const companionId = selectedChat.companion_id || selectedChat.companionId || selectedChat.id
          if (companionId) {
            chat.setLoadingChatId(true)
            
            try {
              const chatId = await websocket.sendJoinChat(companionId)
              
              const updatedChat = {
                ...selectedChat,
                chat_id: chatId
              }
              
              const updatedItems = chat.items.map(item => 
                item === selectedChat ? updatedChat : item
              )

              chat.setItems(updatedItems)
              chat.selectChat(updatedChat)
              
              await messages.fetchHistoryByChatId?.(chatId, 0, 50)
              
            } catch (error) {
              console.error('Ошибка получения chat_id через WebSocket:', error)
              await messages.fetchHistoryByCompanionId?.(companionId, 0, 50)
            } finally {
              chat.setLoadingChatId(false)
            }
          } else if (selectedChat.companion_login) {
          await messages.fetchMessages?.(selectedChat.companion_login)
          } else {
            messages.clearMessages?.()
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке истории чата:', error)
      }
      if (cancelled) return
    }
    run()
    
    return () => { cancelled = true }
  }, [selectedChat, messages, websocket, chat])

  useEffect(() => {
    try {
      const currentChatId = chat.selectedChat?.chat_id
      const userId = getUserId()
      if (!currentChatId || !userId) return

      const items = messages.items || []
      const unreadIncoming = items.filter(m => !m.from_me && (m.is_read === false || m.is_read === undefined))
      if (unreadIncoming.length === 0) return

      const lastUnread = unreadIncoming[unreadIncoming.length - 1]
      let untilTimestamp = lastUnread?.timestamp || lastUnread?.time
      
      // Если время не найдено в данных сообщения, попробуем получить из DOM
      if (!untilTimestamp) {
        untilTimestamp = getLastUnreadMessageTimeFromDOM()
      }
      
      if (!untilTimestamp) return

      const prev = lastMarkSentRef.current
      if (prev && prev.chatId === currentChatId && prev.until === untilTimestamp) return

      websocket.sendMarkAsRead(currentChatId, userId, untilTimestamp)
      lastMarkSentRef.current = { chatId: currentChatId, until: untilTimestamp }
    } catch (error) {
      console.error('Ошибка при отправке mark_as_read:', error)
    }
  }, [messages.items, chat.selectedChat, websocket])

  const handleSend = useCallback(async (text, file) => {
    if (!text?.trim() && !file) {
      return
    }
    if (!selectedChat) {
      return
    }

    try {
      const senderId = getUserId()
      
      if (!senderId) {
        console.error('Нет senderId для отправки сообщения')
        return
      }
      
      let chatId = selectedChat.chat_id
            
      if (!chatId) {
        const companionId = selectedChat.companion_id || selectedChat.companionId || selectedChat.id
        if (!companionId) {
          console.error('Нет companionId для чата')
          return
        }

        try {
          chatId = await websocket.sendJoinChat(companionId)
          
          const updatedChat = {
            ...selectedChat,
            is_temporary: false,
            chat_id: chatId,
            companion_id: companionId
          }
          
          const updatedItems = chat.items.map(item => 
            item === selectedChat ? updatedChat : item
          )
          chat.setItems(updatedItems)
          chat.selectChat(updatedChat)
          
        } catch (error) {
          console.error('Ошибка получения chat_id через WebSocket:', error)
          return
        }
      }
      
      const sendMessageSuccess = websocket.sendTextMessage(senderId, chatId, text)

      if (!sendMessageSuccess) {
        console.error('Ошибка отправки сообщения через WebSocket')
        return
      }

      setReplyingTo(null)
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error)
    }
  }, [chat, websocket, selectedChat])

  const handleDeleteAt = useCallback((index) => {
    const message = messages.items?.[index]
    if (message?.id) {
      // Отправляем запрос на удаление через WebSocket
      websocket.sendDeleteMessage(message.id)
    } else {
      // Fallback - удаляем локально если нет ID
    messages.removeMessageAt?.(index)
    }
  }, [messages, websocket])

  const handleDeleteById = useCallback((messageId) => {
    if (messageId) {
      // Отправляем запрос на удаление через WebSocket
      websocket.sendDeleteMessage(messageId)
    }
  }, [websocket])

  const handleEditById = useCallback((messageId, newText) => {
    if (messageId && newText) {
      // Отправляем запрос на редактирование через WebSocket
      websocket.sendEditMessage(messageId, newText)
    }
  }, [websocket])

  const toggleSelect = useCallback((index) => {
    setSelectedIndices(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index])
  }, [])

  const clearSelection = useCallback(() => setSelectedIndices([]), [])

  const bulkDelete = useCallback(() => {
    if (selectedIndices.length === 0) return
    messages.removeMessagesByIndices?.(selectedIndices)
    setSelectedIndices([])
  }, [messages, selectedIndices])

  const [forwardModalOpen, setForwardModalOpen] = useState(false)
  const [pinModalOpen, setPinModalOpen] = useState(false)
  const [pinnedListOpen, setPinnedListOpen] = useState(false)
  const [pinTargetId, setPinTargetId] = useState(null)
  const bulkForward = useCallback(() => {
    if (selectedIndices.length === 0) return
    setForwardModalOpen(true)
  }, [selectedIndices])

  const openPinModal = useCallback((message) => {
    setPinTargetId(message?.id)
    setPinModalOpen(true)
  }, [])

  const pinForScope = useCallback((scope) => {
    if (!pinTargetId) return
    messages.pinMessageById?.(pinTargetId, scope)
    setPinModalOpen(false)
  }, [messages, pinTargetId])

  const unpinById = useCallback((id) => {
    messages.unpinMessageById?.(id)
  }, [messages])
  
  return {
    messages,
    showCallMenu,
    setShowCallMenu,
    showMoreMenu,
    setShowMoreMenu,
    handleSend,
    handleDeleteAt,
    handleDeleteById,
    handleEditById,
    replyingTo,
    handleReply: setReplyingTo,
    handleCancelReply: () => setReplyingTo(null),
    selectedIndices,
    toggleSelect,
    clearSelection,
    bulkDelete,
    bulkForward,
    forwardModalOpen,
    setForwardModalOpen,
    pinModalOpen,
    setPinModalOpen,
    openPinModal,
    pinForScope,
    pinnedListOpen,
    setPinnedListOpen,
    unpinById,
    getPinned: () => messages.getPinnedMessages?.() || [],
  }
}
