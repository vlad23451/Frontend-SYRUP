/**
 * @fileoverview Главный компонент приложения с роутингом
 * 
 * Этот компонент является корневым для всего приложения и содержит:
 * - Настройку роутинга с помощью React Router
 * - Структуру приложения с навигационной панелью
 * - Определение всех маршрутов приложения
 * - Основную разметку с контейнерами
 * 
 * Маршруты:
 * - "/" - главная страница с историями
 * - "/login" - страница авторизации
 * - "/register" - страница регистрации
 * - "/profile" - профиль пользователя
 * - "/messenger" - мессенджер
 * - "/people" - люди
 * - "/profile/:id" - профиль пользователя
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useEffect } from "react"

import Login from "./pages/Login"
import Histories from "./pages/Histories"
import Dock from './components/ui/Dock'
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import Messenger from "./pages/Messenger"
import People from "./pages/People"
import Following from "./pages/Following"
import UserProfile from "./pages/UserProfile"
import SettingsModal from './components/settings/SettingsModal'
import SettingsHubModal from './components/settings/SettingsHubModal'
import DockSettingsModal from './components/settings/DockSettingsModal'
import { SettingsProvider, useSettings } from './contexts/SettingsContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/ui/ErrorBoundary'

import connectService from "./services/connectService"

const SettingsPortals = () => {
    const { isOpen, activeSection, close } = useSettings()

    useEffect(() => {
      window.__settingsSectionOpen = !!(isOpen && activeSection)
      const handler = () => { window.dispatchEvent(new Event('settings-section-toggle')) }
      handler()
    }, [isOpen, activeSection])
    return (
      <>
        {isOpen && !activeSection && (
          <SettingsHubModal open={true} onClose={close} />
        )}
        {isOpen && activeSection && (
          activeSection === 'dock'
            ? <DockSettingsModal open={true} onClose={close} />
            : <SettingsModal open={true} onClose={close} initialTab={activeSection} singleMode={true} />
        )}
      </>
    )
}

const InitServices = () => {
  useEffect(() => { connectService() }, [])
  return null
}

const App = () => {
    return (
        <ErrorBoundary>
          <Router>
            <SettingsProvider>
              <div className="main-container">
                <InitServices />
                <main className="page-container">
                <Routes>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/register" element={<Register/>}/>
                  
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Histories/>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile/>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile/:id" element={
                    <ProtectedRoute>
                      <UserProfile/>
                    </ProtectedRoute>
                  } />
                  <Route path="/people" element={
                    <ProtectedRoute>
                      <People/>
                    </ProtectedRoute>
                  } />
                  <Route path="/following" element={
                    <ProtectedRoute>
                      <Following/>
                    </ProtectedRoute>
                  } />
                  <Route path="/messenger" element={
                    <ProtectedRoute>
                      <Messenger/>
                    </ProtectedRoute>
                  }/>
                  <Route path="/messenger/:userId" element={
                    <ProtectedRoute>
                      <Messenger/>
                    </ProtectedRoute>
                  }/>
                </Routes>
              </main>
              <Dock />
              <SettingsPortals />
            </div>
          </SettingsProvider>
        </Router>
      </ErrorBoundary>
    )
}

export default App
