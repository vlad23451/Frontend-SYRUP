import React from 'react'

const CommentInput = ({ newComment, setNewComment, submitting, onSubmit }) => (
  <form className="comment-form" onSubmit={onSubmit}>
    <div className="comment-input-container">
      <input
        type="text"
        className="comment-input"
        placeholder="Написать комментарий..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        disabled={submitting}
      />
      <button
        type="submit"
        className="comment-submit-btn"
        disabled={!newComment.trim() || submitting}
        title="Отправить"
      >
        {submitting ? '…' : '➤'}
      </button>
    </div>
  </form>
)

export default CommentInput


