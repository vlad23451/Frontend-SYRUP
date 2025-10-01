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
 * - "/history/:id" - просмотр отдельной истории
 * - "/favorites" - избранные истории
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

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

import Login from "./pages/Login"
import Histories from "./pages/Histories"
import HistoryView from "./pages/HistoryView"
import ResponsiveDock from './components/ui/ResponsiveDock'
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import Messenger from "./pages/Messenger"
import People from "./pages/People"
import Following from "./pages/Following"
import Favorites from "./pages/Favorites"
import UserProfile from "./pages/UserProfile"
import SettingsModal from './components/settings/SettingsModal'
import SettingsHubModal from './components/settings/SettingsHubModal'
import DockSettingsModal from './components/settings/DockSettingsModal'
import { SettingsProvider, useSettings } from './contexts/SettingsContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { ProfileModalProvider } from './contexts/ProfileModalContext'
import { ToastProvider } from './contexts/ToastContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { HistoryViewsProvider } from './contexts/HistoryViewsContext'
import { ContextMenuProvider } from './contexts/ContextMenuContext'
import { MediaPlayerProvider, useMediaPlayer } from './contexts/MediaPlayerContext'
import MediaPlayerModal from './components/common/MediaPlayerModal'
import ProfileModal from './components/profile/ProfileModal'
import { useProfileModal } from './contexts/ProfileModalContext'

import connectService from "./services/connectService"
import NotificationContainer from './components/ui/NotificationContainer'

const GlobalProfileModal = () => {
  const { modalState, closeProfileModal, handleGoToChat, handleGoToProfile, handleGoToFavorites } = useProfileModal()
  return (
    <ProfileModal
      open={modalState.open}
      user={modalState.user}
      loading={modalState.loading}
      error={modalState.error}
      onClose={closeProfileModal}
      onGoToChat={handleGoToChat}
      onGoToProfile={handleGoToProfile}
      onGoToFavorites={handleGoToFavorites}
    />
  )
}

const GlobalMediaPlayerModal = () => {
  const { isOpen, files, initialIndex, closeMediaPlayer } = useMediaPlayer()
  return (
    <MediaPlayerModal
      isOpen={isOpen}
      onClose={closeMediaPlayer}
      files={files}
      initialIndex={initialIndex}
    />
  )
}

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
  const [isInitialized, setIsInitialized] = useState(false)
  
  useEffect(() => { 
    if (!isInitialized) {
      connectService()
      setIsInitialized(true)
    }
  }, [isInitialized])
  
  return null
}

const SPANavigationTracker = () => {
  const location = useLocation()
  
  useEffect(() => {
    sessionStorage.setItem('spa-navigation', 'true')
  }, [location.pathname])
  
  return null
}

const App = () => {
    return (
        <ErrorBoundary>
          <Router>
            <SettingsProvider>
              <ProfileModalProvider>
                <ToastProvider>
                  <FavoritesProvider>
                    <HistoryViewsProvider>
                      <ContextMenuProvider>
                        <MediaPlayerProvider>
                <div className="main-container">
                <InitServices />
                <SPANavigationTracker />
                <main className="page-container">
                <Routes>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/register" element={<Register/>}/>
                  
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Histories/>
                    </ProtectedRoute>
                  } />
                  <Route path="/history/:id" element={
                    <ProtectedRoute>
                      <HistoryView/>
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
                  <Route path="/favorites" element={
                    <ProtectedRoute>
                      <Favorites/>
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
              <ResponsiveDock />
              <SettingsPortals />
              <GlobalProfileModal />
              <GlobalMediaPlayerModal />
              <NotificationContainer />
            </div>
                        </MediaPlayerProvider>
                      </ContextMenuProvider>
                    </HistoryViewsProvider>
                  </FavoritesProvider>
                </ToastProvider>
              </ProfileModalProvider>
          </SettingsProvider>
        </Router>
      </ErrorBoundary>
    )
}

export default App
