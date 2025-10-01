import { useDockPosition } from './dock/useDockPosition'
import { useDockSearch } from './dock/useDockSearch'
import { useDockItems } from './dock/useDockItems'

export const useDockController = () => {

  const { dockRef, innerRef, handleRef, styleDock } = useDockPosition()
  const { isPeople, currentTab } = useDockSearch()
  const { items, isActivePath, handleItemClick, isAuthenticated, isFollowingPage } = useDockItems({ isPeople })

  const showBackButton = Boolean(window.__settingsSectionOpen)
  const openSettings = () => window.dispatchEvent(new Event('open-settings'))

  return {
    dockRef,
    innerRef,
    handleRef,
    styleDock,
    items,
    isActivePath,
    isPeople,
    isAuthenticated,
    currentTab,
    handleItemClick,
    showBackButton,
    openSettings,
    isFollowingPage,
  }
}
