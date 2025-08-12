/**
 * @fileoverview Хук для WebSocket мессенджера
 * 
 * Этот хук предоставляет логику для работы с WebSocket соединением в мессенджере.
 * Управляет подключением к серверу, отправкой и получением сообщений в реальном времени.
 * 
 * Функциональность:
 * - Подключение к WebSocket серверу
 * - Автоматическое присоединение к чату при наличии username
 * - Получение сообщений в реальном времени
 * - Отправка новых сообщений
 * - Управление состоянием подключения
 * 
 * Состояния:
 * - messages: массив сообщений чата
 * - username: имя пользователя (из localStorage)
 * - joined: флаг присоединения к чату
 * - socketRef: ссылка на WebSocket соединение
 * 
 * WebSocket события:
 * - 'join': присоединение к чату с username
 * - 'message': получение нового сообщения
 * - 'message': отправка нового сообщения
 * 
 * Конфигурация:
 * - SOCKET_URL: URL WebSocket сервера (http://localhost:8000)
 * 
 * Возвращаемые значения:
 * - messages: массив сообщений
 * - username: имя пользователя
 * - setUsername: функция установки имени пользователя
 * - sendMessage: функция отправки сообщения
 * 
 * @returns {Object} объект с данными чата и функциями управления
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:8000'

export const useSocketMessenger = () => {
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [joined, setJoined] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = io(SOCKET_URL)
    
    socketRef.current.on('message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => socketRef.current?.disconnect()
  }, [])

  useEffect(() => {
    if (username && !joined && socketRef.current) {
      socketRef.current.emit('join', { username })
      setJoined(true)
    }
  }, [username, joined])

  const sendMessage = (text) => {
    if (text.trim() && socketRef.current) {
      socketRef.current.emit('message', { text })
    }
  }

  return { messages, username, setUsername, sendMessage }
} 
