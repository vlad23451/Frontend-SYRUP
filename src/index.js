/**
 * @fileoverview Главная точка входа в React приложение
 * 
 * Этот файл является корневым для React приложения. Он:
 * - Импортирует React и ReactDOM
 * - Создает корневой элемент для рендеринга
 * - Подключает главный компонент App
 * - Импортирует глобальные стили
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { StoreProvider } from './stores/StoreContext'

import './styles/theme.css'
import './styles/main.css'
import './styles/forms.css'
import './styles/modals.css'
import './styles/histories.css'
import './styles/profile.css'
import './styles/messenger.css'
import './styles/auth.css'
import './styles/comments.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
)
