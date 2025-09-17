import React, { useEffect, useRef } from 'react'

import HistoryPreview from './HistoryPreview'
import CommentList from './CommentList'
import CommentInput from './CommentInput'
import ConfirmModal from '../common/ConfirmModal'
import { useDraggableModal } from '../../hooks/useDraggableModal'
import { useCommentsController } from '../../hooks/useCommentsController'

const CommentsModal = ({ open, history, onClose, onCommentCountUpdate }) => {
  const {
    comments,
    loading,
    newComment,
    submitting,
    error,
    editingComment,
    editText,
    deleteConfirm,
    loadingReactions,
    endRef,
    setNewComment,
    setEditText,
    handleSubmit,
    requestDelete,
    handleEditComment,
    startEditing,
    cancelEditing,
    toggleLike,
    toggleDislike,
    isAuthenticated,
    isOwnComment,
  } = useCommentsController({ open, history, onCommentCountUpdate })

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  const handleBackdrop = (e) => {
    if (e.target.classList.contains('custom-modal-backdrop')) onClose()
  }

  const containerRef = useRef(null)
  const modalRef = useRef(null)
  const grabRef = useRef(null)
  useDraggableModal(open, containerRef, grabRef)

  if (!open) return null

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdrop}>
      <div className="custom-modal-wrapper" ref={containerRef}>
        <div className="custom-modal comments-modal" ref={modalRef}>

        <div className="comments-content">
          {history && <HistoryPreview history={history} />}
          <div className="comments-divider" />
          <div className="comments-divider" />
          {error && (
            <div className="comments-error">
              <p>{error}</p>
            </div>
          )}
          {loading ? (
            <div className="comments-loading">
              <div className="loading-spinner" />
              <p>Загрузка комментариев...</p>
            </div>
          ) : (
            <>
              <CommentList
                comments={comments}
                editingComment={editingComment}
                editText={editText}
                setEditText={setEditText}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                handleEditComment={handleEditComment}
                toggleLike={toggleLike}
                toggleDislike={toggleDislike}
                onDelete={requestDelete}
                endRef={endRef}
                isAuthenticated={isAuthenticated}
                isOwnComment={isOwnComment}
                loadingReactions={loadingReactions}
              />

              <CommentInput
                newComment={newComment}
                setNewComment={setNewComment}
                submitting={submitting}
                onSubmit={handleSubmit}
              />
            </>
          )}
          </div>
        </div>
        <div className="modal-drag-handle bottom external" ref={grabRef} title="Переместить" />
        <div className="modal-drag-visible bottom external" />
      </div>
      <ConfirmModal
        open={!!deleteConfirm}
        message={deleteConfirm?.message}
        onCancel={deleteConfirm?.onCancel}
        onConfirm={deleteConfirm?.onConfirm}
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  )
}

export default CommentsModal
