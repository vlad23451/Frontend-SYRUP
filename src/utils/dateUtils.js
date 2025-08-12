/**
 * @fileoverview Утилиты для работы с датами и временем
 * 
 * Этот модуль содержит функции для форматирования дат и времени с учётом таймзоны пользователя.
 * Все функции ориентированы на работу с ISO-датами от сервера.
 * 
 * Основные функции:
 * - formatDateTime: простое форматирование даты (устаревшее)
 * - getUserLocalDate: получение объекта Date в таймзоне пользователя
 * - formatHistoryDateTime: форматирование даты для UI с учётом таймзоны
 * 
 * Особенности:
 * - Использует библиотеку date-fns-tz для работы с таймзонами
 * - Серверные даты без Z считаются UTC
 * - Поддержка относительных дат ("Сегодня, 14:30")
 * - Автоматическое определение таймзоны пользователя
 * 
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import { format, toZonedTime } from 'date-fns-tz'

export const formatDateTime = (isoString) => {
  const date = new Date(isoString)
  return {
    date: date.toLocaleDateString("ru-RU"),
    time: date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }
}

export const getUserLocalDate = (dateString, userTimezone) => {
  if (!dateString) return null
  const date = new Date(dateString)
  if (!userTimezone) return date
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
  return new Date(Intl.DateTimeFormat('en-US', { timeZone: userTimezone }).format(new Date(utc)))
}

export const formatHistoryDateTime = (dateString, userTimezone) => {
  if (!dateString) return ''
  const timeZone = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  // Принудительно добавляем Z, если нет таймзоны (считаем, что сервер отдаёт UTC)
  const iso = dateString.endsWith('Z') || dateString.match(/[+-]\d{2}:\d{2}$/)
    ? dateString
    : dateString + 'Z'
  const date = toZonedTime(new Date(iso), timeZone)
  const now = toZonedTime(new Date(), timeZone)
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  if (isToday) {
    return `Сегодня, ${format(date, 'HH:mm', { timeZone })}`
  }
  return format(date, 'dd.MM.yyyy, HH:mm', { timeZone })
}

// For messenger bubbles: separate label (Сегодня / dd.MM.yyyy) and time HH:mm
export const formatMessageDateParts = (dateString, userTimezone) => {
  if (!dateString) return { label: '', time: '' }
  const timeZone = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  // Принудительно добавляем Z, если нет таймзоны (считаем, что сервер отдаёт UTC)
  const iso = dateString.endsWith('Z') || dateString.match(/[+-]\d{2}:\d{2}$/)
    ? dateString
    : dateString + 'Z'
  const date = toZonedTime(new Date(iso), timeZone)
  const now = toZonedTime(new Date(), timeZone)
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  return {
    label: isToday ? 'Сегодня' : format(date, 'dd.MM.yyyy', { timeZone }),
    time: format(date, 'HH:mm', { timeZone })
  }
}
