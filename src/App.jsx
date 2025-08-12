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
        <Router>
          <SettingsProvider>
            <div className="main-container">
              <InitServices />
              <main className="page-container">
                <Routes>
                  <Route path="/" element={<Histories/>} />
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/register" element={<Register/>}/>
                  <Route path="/profile" element={<Profile/>} />
                  <Route path="/profile/:id" element={<UserProfile/>} />
                  <Route path="/people" element={<People/>} />
                  <Route path="/following" element={<Following/>} />
                  <Route path="/messenger" element={<Messenger/>}/>
                </Routes>
              </main>
              <Dock />
              <SettingsPortals />
            </div>
          </SettingsProvider>
        </Router>
    )
}

export default App
