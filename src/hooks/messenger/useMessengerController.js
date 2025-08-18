import { useEffect, useState, useCallback } from 'react'
import { useStore } from '../../stores/StoreContext'

export const useMessengerController = (selectedChat) => {
  const { messages } = useStore()
  const [showCallMenu, setShowCallMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [selectedIndices, setSelectedIndices] = useState([])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      // Очистить при отсутствии выбранного чата
      if (!selectedChat) {
        messages.clearMessages?.()
        return
      }
      // Загрузка истории при выборе чата
      try {
        const companionId = selectedChat.companion_id || selectedChat.companionId || selectedChat.id
        if (companionId) {
          await messages.fetchHistoryByCompanionId?.(companionId, 0, 50)
        } else if (selectedChat.companion_login) {
          await messages.fetchMessages?.(selectedChat.companion_login)
        } else {
          messages.clearMessages?.()
        }
      } catch (e) {
        // no-op
      }
      if (cancelled) return
    }
    run()
    return () => { cancelled = true }
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


