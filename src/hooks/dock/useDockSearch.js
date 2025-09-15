import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useDockSearch = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const currentTab = searchParams.get('tab') || 'all'
  const currentQuery = searchParams.get('q') || ''

  const [searchValue, setSearchValue] = useState(currentQuery)
  useEffect(() => { setSearchValue(currentQuery) }, [currentQuery])

  const timerRef = useRef(null)
  const updateSearch = (value) => {
    setSearchValue(value)

    if (timerRef.current) clearTimeout(timerRef.current)
      
    timerRef.current = setTimeout(() => {
      const url = `/people?tab=${currentTab}&q=${encodeURIComponent(value)}`
      navigate(url, { replace: true })
    }, 250)
  }

  const isPeople = location.pathname.startsWith('/people')

  return {
    isPeople,
    currentTab,
    searchValue,
    setSearchValue: updateSearch,
  }
}
