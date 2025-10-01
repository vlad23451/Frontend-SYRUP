import React, { useEffect, useState, useCallback } from "react"
import { observer } from 'mobx-react-lite'
import { useStore } from '../../stores/StoreContext'
import CreateHistoryModal from "../histories/CreateHistoryModal"
import UserHistoriesHeader from "./UserHistoriesHeader"
import UserHistoriesLoading from "./UserHistoriesLoading"
import UserHistoriesError from "./UserHistoriesError"
import UserHistoriesEmpty from "./UserHistoriesEmpty"
import UserHistoriesList from "./UserHistoriesList"

const UserHistories = observer(() => {
  const { myHistories } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    myHistories.fetchMyHistories()
  }, [myHistories])

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleHistoryCreated = useCallback(() => {
    myHistories.fetchMyHistories()
    handleCloseModal()
  }, [myHistories])

  const removeHistory = (historyId) => {
    myHistories.removeById(historyId)
  }

  const updateHistoryLocal = (updated) => {
    myHistories.updateItem(updated)
  }

  if (myHistories.loading) {
    return <UserHistoriesLoading />
  }

  if (myHistories.error) {
    return <UserHistoriesError error={myHistories.error} />
  }

  return (
    <div className="user-histories">
      <UserHistoriesHeader onOpenModal={handleOpenModal} historiesCount={myHistories.items.length} />
      {myHistories.items.length === 0 ? (
        <UserHistoriesEmpty />
      ) : (
        <UserHistoriesList histories={myHistories.items} onDelete={removeHistory} onUpdate={updateHistoryLocal} />
      )}
      <CreateHistoryModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleHistoryCreated}
      />
    </div>
  )
})

export default UserHistories 
