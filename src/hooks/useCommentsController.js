import { useEffect, useRef, useState } from 'react'
import { useStore } from '../stores/StoreContext'
import {
  createComment,
  getComments,
  deleteComment,
  updateComment,
  createCommentLike,
  deleteCommentLike,
  createCommentDislike,
  deleteCommentDislike,
} from '../services/commentService'

export const useCommentsController = ({ open, history, onCommentCountUpdate }) => {
  const { auth } = useStore()

  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const endRef = useRef(null)

  useEffect(() => {
    if (!open || !history?.id) return

    const fetchComments = async () => {
      setLoading(true)
      setError(null)
      try {
        const commentsData = await getComments(history.id)
        
        const commentsWithReactions = (commentsData || []).map((comment) => {
          const currentUserLiked = comment.liked_users.some((user) => user.follow_status === 'me') || false
          const currentUserDisliked = comment.disliked_users.some((user) => user.follow_status === 'me') || false
          
          return {
            ...comment,
            isLikeActive: currentUserLiked,
            isDislikeActive: currentUserDisliked,
            likeCount: comment.likes || 0,
            dislikeCount: comment.dislikes || 0,
            likeId: currentUserLiked
              ? comment.liked_users.find((user) => user.follow_status === 'me')?.like_id || null
              : null,
            dislikeId: currentUserDisliked
              ? comment.disliked_users.find((user) => user.follow_status === 'me')?.dislike_id || null
              : null,
          }
        })
        setComments(commentsWithReactions)
      } catch (error) {
        console.error('Ошибка загрузки комментариев:', error)
        setError('Не удалось загрузить комментарии')
        setComments([])
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [open, history?.id])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [comments])

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    const text = newComment.trim()
    if (!text || !history?.id) return

    setSubmitting(true)
    setError(null)

    try {
      const newCommentData = await createComment(history.id, text, 'text', {})
      const commentToAdd = {
        id: newCommentData.id || Date.now(),
        content: text,
        created_at: newCommentData.created_at || new Date().toISOString(),
        updated_at: newCommentData.updated_at || new Date().toISOString(),
        user_info: {
          id: auth?.user?.id || auth?.user?.user_info?.id,
          login: auth?.user?.login || auth?.user?.user_info?.login || 'Вы',
          about: auth?.user?.about || auth?.user?.user_info?.about || '',
          avatar_key: auth?.user?.avatar || auth?.user?.user_info?.avatar || auth?.user?.avatar_key || null,
          follow_status: 'not_following',
        },
        comment_type: 'text',
        comment_metadata: {},
        isLikeActive: false,
        isDislikeActive: false,
        likeCount: 0,
        dislikeCount: 0,
      }

      setComments((prev) => [...prev, commentToAdd])
      setNewComment('')
      if (onCommentCountUpdate) onCommentCountUpdate(comments.length + 1)
    } catch (err) {
      console.error('Ошибка создания комментария:', err)
      setError('Не удалось отправить комментарий')
    } finally {
      setSubmitting(false)
    }
  }

  const requestDelete = (commentId) => {
    setDeleteConfirm({
      message: 'Вы уверены, что хотите удалить этот комментарий?',
      onConfirm: async () => {
        setDeleteConfirm(null)
        setError(null)
        try {
          await deleteComment(commentId)
          setComments((prev) => {
            const newComments = prev.filter((c) => c.id !== commentId)
            if (onCommentCountUpdate) onCommentCountUpdate(newComments.length)
            return newComments
          })
        } catch (err) {
          console.error('Ошибка удаления комментария:', err)
          setError('Не удалось удалить комментарий')
        }
      },
      onCancel: () => setDeleteConfirm(null),
    })
  }

  const handleEditComment = async (commentId, newText) => {
    if (!newText.trim()) return
    setError(null)
    try {
      const updatedCommentData = await updateComment(commentId, newText.trim())
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, content: newText.trim(), updated_at: updatedCommentData.updated_at || new Date().toISOString() }
            : c
        )
      )
      setEditingComment(null)
      setEditText('')
    } catch (err) {
      console.error('Ошибка редактирования комментария:', err)
      setError('Не удалось отредактировать комментарий')
    }
  }

  const startEditing = (comment) => {
    setEditingComment(comment.id)
    setEditText(comment.content)
  }

  const cancelEditing = () => {
    setEditingComment(null)
    setEditText('')
  }

  const toggleLike = async (id) => {
    const comment = comments.find((c) => c.id === id)
    if (!comment) return
    setError(null)
    try {
      if (comment.isLikeActive) {
        await deleteCommentLike(comment.likeId)
        setComments((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, isLikeActive: false, likeCount: Math.max(0, (c.likeCount || 0) - 1), likeId: null }
              : c
          )
        )
      } else {
        const likeResponse = await createCommentLike(id)
        setComments((prev) =>
          prev.map((c) => {
            if (c.id !== id) return c
            const decDislike = c.isDislikeActive ? 1 : 0
            return {
              ...c,
              isLikeActive: true,
              likeCount: (c.likeCount || 0) + 1,
              likeId: likeResponse.id || likeResponse,
              isDislikeActive: false,
              dislikeCount: Math.max(0, (c.dislikeCount || 0) - decDislike),
              dislikeId: null,
            }
          })
        )
      }
    } catch (err) {
      console.error('Ошибка при работе с лайком:', err)
      setError('Не удалось обновить лайк')
    }
  }

  const toggleDislike = async (id) => {
    const comment = comments.find((c) => c.id === id)
    if (!comment) return
    setError(null)
    try {
      if (comment.isDislikeActive) {
        await deleteCommentDislike(comment.dislikeId)
        setComments((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, isDislikeActive: false, dislikeCount: Math.max(0, (c.dislikeCount || 0) - 1), dislikeId: null }
              : c
          )
        )
      } else {
        const dislikeResponse = await createCommentDislike(id)
        setComments((prev) =>
          prev.map((c) => {
            if (c.id !== id) return c
            const decLike = c.isLikeActive ? 1 : 0
            return {
              ...c,
              isDislikeActive: true,
              dislikeCount: (c.dislikeCount || 0) + 1,
              dislikeId: dislikeResponse.id || dislikeResponse,
              isLikeActive: false,
              likeCount: Math.max(0, (c.likeCount || 0) - decLike),
              likeId: null,
            }
          })
        )
      }
    } catch (err) {
      console.error('Ошибка при работе с дизлайком:', err)
      setError('Не удалось обновить дизлайк')
    }
  }

  return {
    // state
    comments,
    loading,
    newComment,
    submitting,
    error,
    editingComment,
    editText,
    deleteConfirm,
    endRef,
    // setters
    setNewComment,
    setDeleteConfirm,
    setEditText,
    // actions
    handleSubmit,
    requestDelete,
    handleEditComment,
    startEditing,
    cancelEditing,
    toggleLike,
    toggleDislike,
    // derived
    isAuthenticated: !!auth?.user,
    isOwnComment: (c) =>
      c?.user_info?.login === (auth?.user?.login || auth?.user?.user_info?.login) ||
      c?.user_info?.id === (auth?.user?.id || auth?.user?.user_info?.id),
  }
}
