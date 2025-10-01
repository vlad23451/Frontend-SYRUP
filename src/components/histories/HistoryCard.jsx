import { useState, useRef, useEffect } from 'react'

import { useHistoryComments } from '../../hooks/useHistoryComments'
import { useHistoryActions } from '../../hooks/useHistoryActions'
import { useHistoryDates } from '../../hooks/useHistoryDates'
import { useCommentsModal } from '../../hooks/useCommentsModal'
import { useHistoryViews } from '../../contexts/HistoryViewsContext'

import HistoryHeader from './HistoryHeader'
import HistoryActions from './HistoryActions'
import HistoryContent from './HistoryContent'
import CommentsModal from '../comments/CommentsModal'
import EditHistoryModal from './EditHistoryModal'
import EditHistoryAttachments from './EditHistoryAttachments'
import ConfirmModal from '../common/ConfirmModal'
import { getUserFromStorage } from '../../utils/localStorageUtils'

const HistoryCard = ({ history, onDelete, onUpdate, forceMeAsAuthor = false, overrideAuthor, isOwner: isOwnerProp }) => {
  const { commentCount, updateCommentCount } = useHistoryComments(history)
  const { 
    isDeleting, 
    showConfirmModal, 
    handleEdit: handleEditFromHook, 
    handleDelete, 
    handleConfirmDelete, 
    handleCancelDelete 
  } = useHistoryActions(history, onDelete)
  const { publishedAtStr, updatedAtStr, hasUpdate } = useHistoryDates(history)
  const { commentsModal, handleOpenCommentsModal, handleCloseCommentsModal } = useCommentsModal()
  const { observeElement, unobserveElement } = useHistoryViews()
  const cardRef = useRef(null)

  const currentUser = getUserFromStorage()
  const isOwnerComputed = Boolean(history?.author?.id && currentUser?.user_info?.id === history.author.id)
  const isOwner = typeof isOwnerProp === 'boolean' ? isOwnerProp : isOwnerComputed

  const [isEditOpen, setEditOpen] = useState(false)
  const [isEditAttachmentsOpen, setEditAttachmentsOpen] = useState(false)

  const handleEdit = () => setEditOpen(true)
  const handleEditClose = () => setEditOpen(false)
  
  const handleEditAttachments = () => setEditAttachmentsOpen(true)
  const handleEditAttachmentsClose = () => setEditAttachmentsOpen(false)

  // Отслеживаем видимость карточки для автоматического просмотра
  useEffect(() => {
    if (cardRef.current && history) {
      observeElement(cardRef.current)
    }
    return () => {
      if (cardRef.current) {
        unobserveElement(cardRef.current)
      }
    }
  }, [observeElement, unobserveElement, history?.id])

  if (!history) {
    return null
  }

  return (
      <div 
        ref={cardRef}
        className="history-card history-card-bordered wide history-card-anchor" 
        data-id={history.id}
        data-history-id={history.id}
      >
      <HistoryHeader 
        history={history} 
        forceMeAsAuthor={forceMeAsAuthor} 
        overrideAuthor={overrideAuthor}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onEditAttachments={handleEditAttachments}
        isDeleting={isDeleting}
        isOwner={isOwner}
      />

      <HistoryContent history={history} />

      <HistoryActions 
        history={history}
        commentCount={commentCount}
        onCommentClick={handleOpenCommentsModal}
        publishedAtStr={publishedAtStr}
        updatedAtStr={updatedAtStr}
        hasUpdate={hasUpdate}
      />

      <CommentsModal 
        open={commentsModal.open}
        history={history}
        onClose={handleCloseCommentsModal}
        onCommentCountUpdate={updateCommentCount}
      />

      <ConfirmModal
        open={showConfirmModal}
        message="Вы уверены, что хотите удалить эту историю?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Удалить"
        cancelText="Отмена"
      />

      <EditHistoryModal 
        isOpen={isEditOpen}
        onClose={handleEditClose}
        history={history}
        onSuccess={(updated) => {onUpdate(updated)}}
      />

      <EditHistoryAttachments 
        history={history}
        onUpdate={onUpdate}
        onClose={handleEditAttachmentsClose}
        isOpen={isEditAttachmentsOpen}
      />

    </div>
  )
}

export default HistoryCard 
