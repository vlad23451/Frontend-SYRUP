import { createContext, useContext } from 'react'
import RootStore from './RootStore'

const rootStore = RootStore
const StoreContext = createContext(rootStore)

export const StoreProvider = ({ children }) => {
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return store
} 
