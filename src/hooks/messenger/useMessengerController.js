import { useEffect, useState, useCallback } from 'react'
import { useStore } from '../../stores/StoreContext'

export const useMessengerController = (selectedChat) => {
  const { messages } = useStore()
  const [showCallMenu, setShowCallMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [selectedIndices, setSelectedIndices] = useState([])

  useEffect(() => {
    if (!selectedChat) {
      messages.clearMessages?.()
      return
    }
    messages.setItems?.([
      { user: selectedChat.companion_login, text: 'Привет! Как дела?', time: new Date(Date.now() - 1000*60*5).toISOString() },
      { user: 'Вы', text: 'Привет! Всё отлично. Тестовый диалог.', time: new Date(Date.now() - 1000*60*4).toISOString() },
      { user: selectedChat.companion_login, text: 'Здорово! Проверяю модалку 😉', time: new Date(Date.now() - 1000*60*3).toISOString() },
      { user: 'Вы', text: 'Да, выглядит супер!', time: new Date(Date.now() - 1000*60*2).toISOString() },
    ])
  }, [selectedChat, messages])

  const handleSend = useCallback((text, file) => {
    if (!text?.trim() && !file) return
    messages.addMessage({ 
      user: 'Вы', 
      text, 
      file, 
      time: new Date().toISOString(),
      replyTo: replyingTo ? {
        user: replyingTo.user,
        text: replyingTo.text,
        time: replyingTo.time,
      } : undefined
    })
    setReplyingTo(null)
  }, [messages, replyingTo])

  const handleDeleteAt = useCallback((index) => {
    messages.removeMessageAt?.(index)
  }, [messages])

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


