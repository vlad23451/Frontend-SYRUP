import { useHistoryReactions } from '../../hooks/histories/useHistoryReactions'

const HistoryActions = ({ 
  history, 
  commentCount, 
  onCommentClick, 
  publishedAtStr, 
  updatedAtStr, 
  hasUpdate,
  onEdit,
  onDelete,
  isDeleting,
  isOwner = false,
}) => {
  const {
    isLikeActive,
    isDislikeActive,
    likeCount,
    dislikeCount,
    handleToggleLike,
    handleToggleDislike,
    isAuthenticated
  } = useHistoryReactions(history)

  return (
    <div className="history-actions-bar">
      <div className="history-actions-left">
        <button 
          className="history-like-btn"
          onClick={handleToggleLike}
          aria-pressed={isLikeActive}
          title={isLikeActive ? 'Убрать лайк' : 'Поставить лайк'}
          disabled={!isAuthenticated}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L22 10z" fill="currentColor"/>
          </svg>
          <span className="history-action-counter">{likeCount}</span>
        </button>
        <button 
          className="history-dislike-btn"
          onClick={handleToggleDislike}
          aria-pressed={isDislikeActive}
          title={isDislikeActive ? 'Убрать дизлайк' : 'Поставить дизлайк'}
          disabled={!isAuthenticated}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22L1.14 11.27c-.09.23-.14.47-.14.73v1.91C1 15.9 1.9 16.8 3 16.8h6l-1 4.57c-.05.23-.05.46 0 .68.12.5.49.88.95 1.02.1.03.21.05.31.05.38 0 .74-.15 1.02-.43L17 18.8c.38-.38.59-.89.59-1.41V5c0-1.1-.9-2-2-2zm4 0h-2v12h2V3z" fill="currentColor"/>
          </svg>
          <span className="history-action-counter">{dislikeCount}</span>
        </button>
        <button 
          className="history-comment-btn" 
          title="Комментарии"
          onClick={onCommentClick}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
          </svg>
          <span className="history-action-counter">{commentCount}</span>
        </button>
      </div>
      <div className="history-actions-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {isOwner && (
          <>
            <button 
              className="history-edit-btn"
              onClick={onEdit}
              title="Редактировать"
            >
              ✏️
            </button>
            <button 
              className="history-delete-btn"
              onClick={onDelete}
              disabled={isDeleting}
              title={isDeleting ? 'Удаление...' : 'Удалить'}
            >
              🗑️
            </button>
          </>
        )}
        <div 
          className="history-publish-date" 
          title={hasUpdate ? 'Дата изменения' : 'Дата публикации'}
          style={{ fontSize: '14px' }}
        >
          {hasUpdate ? (
            <>📝 Изменено: {updatedAtStr}</>
          ) : (
            <>🕓 Опубликовано: {publishedAtStr}</>
          )}
        </div>
      </div>
    </div>
  )
}

export default HistoryActions 
