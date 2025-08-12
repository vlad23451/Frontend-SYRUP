/**
 * @fileoverview Карточка истории
 * 
 * Компонует заголовок, контент, действия, модалку комментариев, модалку редактирования
 * и подтверждение удаления. Делегирует действия наружу через колбэки
 * `onDelete`, `onUpdate` для синхронного обновления списков/MobX.
 */
import { useState } from 'react'
import { useHistoryComments } from '../../hooks/histories/useHistoryComments'
import { useHistoryActions } from '../../hooks/histories/useHistoryActions'
import { useHistoryDates } from '../../hooks/histories/useHistoryDates'
import { useCommentsModal } from '../../hooks/comments/useCommentsModal'
import HistoryHeader from './HistoryHeader'
import HistoryActions from './HistoryActions'
import HistoryContent from './HistoryContent'
import CommentsModal from '../comments/CommentsModal'
import EditHistoryModal from './EditHistoryModal'
import ConfirmModal from '../common/ConfirmModal'

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

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })()
  const isOwnerComputed = Boolean(history?.author?.id && currentUser?.user_info?.id === history.author.id)
  const isOwner = typeof isOwnerProp === 'boolean' ? isOwnerProp : isOwnerComputed

  const [isEditOpen, setEditOpen] = useState(false)

  const handleEdit = () => setEditOpen(true)
  const handleEditClose = () => setEditOpen(false)

  return (
    <div className="history-card history-card-bordered wide">
      <HistoryHeader history={history} forceMeAsAuthor={forceMeAsAuthor} overrideAuthor={overrideAuthor} />
      <HistoryContent history={history} />
      <HistoryActions 
        history={history}
        commentCount={commentCount}
        onCommentClick={handleOpenCommentsModal}
        publishedAtStr={publishedAtStr}
        updatedAtStr={updatedAtStr}
        hasUpdate={hasUpdate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        isOwner={isOwner}
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
    </div>
  )
}

export default HistoryCard 
