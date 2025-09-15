/**
 * @fileoverview Компонент списка историй
 * 
 * Этот компонент отображает список историй чатов пользователя.
 * Обрабатывает пустое состояние и рендерит карточки историй.
 * 
 * Функциональность:
 * - Отображение списка историй в виде карточек
 * - Обработка пустого состояния (нет историй)
 * - Рендеринг компонента HistoryCard для каждой истории
 * - Отображение компонента HistoryListEmpty при отсутствии историй
 * 
 * Структура:
 * - Проверка на пустой массив историй
 * - Рендеринг HistoryListEmpty если историй нет
 * - Рендеринг списка HistoryCard компонентов
 * 
 * @param {Array} histories - массив объектов историй для отображения
 * @author SYRUP CHAT Team
 * @version 1.0.0
 */

import React from 'react'
import HistoryCard from './HistoryCard'
import HistoryListEmpty from './HistoryListEmpty'

const HistoryList = ({ histories, onDeleteHistory, onUpdateHistory, isLoading = false }) => {
  if (isLoading) {
    return null
  }
  
  if (histories.length === 0) {
    return <HistoryListEmpty />
  }

  return (
    <div className="histories-list">
      {histories.map(history => (
        <HistoryCard 
          key={history.id} 
          history={history} 
          onDelete={onDeleteHistory}
          onUpdate={onUpdateHistory}
        />
      ))}
    </div>
  )
}

export default HistoryList 
