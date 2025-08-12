import React from 'react'
import CommentItem from './CommentItem'

const CommentList = ({ comments, editingComment, editText, setEditText, startEditing, cancelEditing, handleEditComment, toggleLike, toggleDislike, onDelete, endRef, isAuthenticated, isOwnComment }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="comments-empty">
        <p>Пока нет комментариев</p>
        <p>Станьте первым!</p>
      </div>
    )
  }
  return (
    <div className="comments-list">
      {comments.map(c => (
        <CommentItem
          key={c.id}
          comment={c}
          editingComment={editingComment}
          editText={editText}
          setEditText={setEditText}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          handleEditComment={handleEditComment}
          toggleLike={toggleLike}
          toggleDislike={toggleDislike}
          onDelete={onDelete}
          isAuthenticated={isAuthenticated}
          isOwnComment={isOwnComment}
        />
      ))}
      <div ref={endRef} />
    </div>
  )
}

export default CommentList


