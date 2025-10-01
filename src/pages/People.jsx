import React, { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import PeopleList from '../components/people/PeopleList'
import '../components/people/PeopleList.css'

const People = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const tab = params.get('tab') || 'all'
  const search = params.get('q') || ''
  const userId = params.get('userId') || ''
  
  const [searchValue, setSearchValue] = useState(search)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  // Обновляем локальное состояние при изменении URL
  useEffect(() => {
    setSearchValue(search)
  }, [search])

  // Обработчик поиска с дебаунсом
  useEffect(() => {
    const timer = setTimeout(() => {
      const url = `/people?tab=${tab}&q=${encodeURIComponent(searchValue)}${userId ? `&userId=${userId}` : ''}`
      navigate(url, { replace: true })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, tab, userId, navigate])

  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded) {
      // Фокусируемся на поле ввода при раскрытии
      setTimeout(() => {
        const input = document.querySelector('.people-search input')
        if (input) input.focus()
      }, 100)
    }
  }

  // Определяем заголовок в зависимости от выбранного таба
  const getPageTitle = () => {
    switch (tab) {
      case 'friends':
        return 'Друзья'
      case 'followers':
        return 'Подписчики'
      case 'following':
        return 'Подписки'
      case 'all':
      default:
        return 'Люди'
    }
  }

  return (
    <div className="people-page">
      <h1 className="people-page-title">{getPageTitle()}</h1>
      <div className="people-search">
        <div className={`search-input-container ${isSearchExpanded ? 'expanded' : ''}`}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onBlur={() => {
              // Скрываем поле если оно пустое
              if (!searchValue.trim()) {
                setIsSearchExpanded(false)
              }
            }}
          />
          <svg 
            className="search-icon" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            onClick={handleSearchIconClick}
            style={{ cursor: 'pointer' }}
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
      </div>
      <div className="people-list-container">
        <PeopleList tab={tab} search={search} userId={userId} />
      </div>
    </div>
  )
}

export default People
