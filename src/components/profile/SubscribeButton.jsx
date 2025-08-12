import { useState, useEffect } from 'react'
import { followUser, unfollowUser } from '../../services/userService'

const SubscribeButton = ({ FollowStatus, targetId, onStatusChange }) => {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(FollowStatus || 'not_following')

    useEffect(() => {
        if (!loading) {
            setStatus(FollowStatus || 'not_following')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [FollowStatus])

    const buttonText = {
        followed_by_me: 'Отписаться',
        following_me: 'Подписаться в ответ',
        not_following: 'Подписаться',
        mutual: 'Удалить из друзей'
    }[status]

    const handleClick = async () => {
        setLoading(true)
        try {
            if (status === 'not_following' || status === 'following_me') {
                const res = await followUser(targetId)
                const server = res?.follow_status ?? res?.data?.follow_status ?? res?.result?.follow_status
                const next = server || (status === 'following_me' ? 'mutual' : 'followed_by_me')
                setStatus(next)
                onStatusChange && onStatusChange(next)
            } else {
                const res = await unfollowUser(targetId)
                const server = res?.follow_status ?? res?.data?.follow_status ?? res?.result?.follow_status
                const next = server || (status === 'mutual' ? 'following_me' : 'not_following')
                setStatus(next)
                onStatusChange && onStatusChange(next)
            }
        } catch (e) {
            if (!(e.message && e.message.includes('Ошибка запроса'))) {
                console.error(e)
                alert('Ошибка при выполнении запроса')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            className={`custom-modal-btn ${status}`}
            onClick={handleClick}
            disabled={loading}
            title={buttonText}
            style={{ whiteSpace: 'nowrap' }}
        >
            {loading ? '...' : buttonText}
        </button>
    )
}

export default SubscribeButton
