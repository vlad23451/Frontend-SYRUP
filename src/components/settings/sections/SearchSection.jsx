import React from 'react'

const SearchSection = ({
  globalSearch,
  setGlobalSearch,
  searchMessages,
  setSearchMessages,
  searchUsers,
  setSearchUsers,
  searchHashtags,
  setSearchHashtags,
  filterDate,
  setFilterDate,
  filterType,
  setFilterType,
  filterAuthor,
  setFilterAuthor,
  savedQueries,
  setSavedQueries,
}) => {
  return (
    <div style={{ display:'grid', gap:10 }}>
      <div style={{ fontWeight:700 }}>Поиск</div>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={globalSearch} onChange={(e)=> setGlobalSearch(e.target.checked)} />
        <span>Глобальный поиск</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={searchMessages} onChange={(e)=> setSearchMessages(e.target.checked)} />
        <span>По сообщениям</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={searchUsers} onChange={(e)=> setSearchUsers(e.target.checked)} />
        <span>По пользователям</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={searchHashtags} onChange={(e)=> setSearchHashtags(e.target.checked)} />
        <span>По хэштегам</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={filterDate} onChange={(e)=> setFilterDate(e.target.checked)} />
        <span>Фильтр по дате</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={filterType} onChange={(e)=> setFilterType(e.target.checked)} />
        <span>Фильтр по типу контента</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={filterAuthor} onChange={(e)=> setFilterAuthor(e.target.checked)} />
        <span>Фильтр по автору</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={savedQueries} onChange={(e)=> setSavedQueries(e.target.checked)} />
        <span>Сохранённые запросы</span>
      </label>
    </div>
  )
}

export default SearchSection


