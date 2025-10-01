/**
 * @fileoverview Конфигуратор пунктов дока
 * 
 * Отвечает за формирование массива пунктов дока в зависимости от:
 * - статуса аутентификации
 * - контекста страницы (люди/поиск, лента подписок)
 * - текущего пути и введённой строки поиска
 * Также вычисляет `isFollowingPage` для условного показа кнопки «Друзья» на странице `/following`.
 */
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useStore } from '../../stores/StoreContext'
import { IconNews,
         IconUsers,
         IconChat,
         IconUser,
         IconLogin,
         IconRegister,
         IconBack,
         IconFollowing } from '../../components/ui/icons/DockIcons'

export const useDockItems = ({ isPeople }) => {
  const { auth } = useStore()
  const location = useLocation()
  const navigate = useNavigate()

  const isFollowingPage = location.pathname.startsWith('/following')

  const items = useMemo(() => {
    if (auth.isAuthenticated) {
      if (isPeople) {
        return [
          { to: '/',
            label: 'Назад',
            Icon: IconBack },

          { to: '/people?tab=all',
            label: 'Все',
            Icon: IconUsers },

          { to: '/people?tab=friends',
            label: 'Друзья',
            Icon: IconUsers },
        ]
      }
      const base = [
        { to: '/', label: 'Истории', Icon: IconNews },
        { to: '/following', label: 'Подписки', Icon: IconFollowing },
        { to: '/people', label: 'Люди', Icon: IconUsers },
        { to: '/messenger', label: 'Чаты', Icon: IconChat },
        { to: '/profile', label: 'Профиль', Icon: IconUser },
      ]
      return base
    }
    return [
      { to: '/', label: 'Истории', Icon: IconNews },
      { to: '/login', label: 'Войти', Icon: IconLogin },
      { to: '/register', label: 'Регистрация', Icon: IconRegister },
    ]
  }, [auth.isAuthenticated, isPeople, location.pathname])

  const isActivePath = (to) => (to === '/'
                                ? location.pathname === '/'
                                : location.pathname.startsWith(to))

  const handleItemClick = (e, to, label) => {
    if (isPeople && label === 'Назад') {
      e.preventDefault()
      navigate('/')
      return
    }

    if (isPeople && (label === 'Все' || label === 'Друзья')) {
      e.preventDefault()
      const tab = label === 'Все' ? 'all' : 'friends'
      navigate(`/people?tab=${tab}`)
      return
    }
  }

  return { items,
           isActivePath,
           handleItemClick,
           isAuthenticated: auth.isAuthenticated,
           isFollowingPage }
}
