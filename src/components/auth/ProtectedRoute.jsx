/**
 * @fileoverview Компонент для защиты маршрутов
 * 
 * Проверяет аутентификацию пользователя и перенаправляет на страницу входа
 * если пользователь не авторизован. Используется для защиты приватных страниц.
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../stores/StoreContext'

const ProtectedRoute = observer(({ children }) => {
  const { auth } = useStore()
  const location = useLocation()

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
})

export default ProtectedRoute
