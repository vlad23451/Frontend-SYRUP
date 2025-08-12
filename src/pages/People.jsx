import React, { useMemo } from 'react'
import PeopleList from '../components/people/PeopleList'
import '../components/people/PeopleList.css'
import { useLocation } from 'react-router-dom'

const People = () => {
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const tab = params.get('tab') || 'all'
  const search = params.get('q') || ''
  const userId = params.get('userId') || ''

  return (
    <div className="people-page">
      <h1>Люди</h1>
      <PeopleList tab={tab} search={search} userId={userId} />
    </div>
  )
}

export default People
