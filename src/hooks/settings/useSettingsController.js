import { useEffect, useRef, useState } from 'react'
import { useLocalStoragePersist } from '../useLocalStorage'
import { useApplyTheme, useApplyPrimaryColor, useApplyCustomTheme, useApplyTypography, useApplyBackground } from '../useApplyAppearance'

export const useSettingsController = ({ open, onClose, initialTab, singleMode }) => {
  const containerRef = useRef(null)

  const [snapEnabled, setSnapEnabled] = useState(() => (localStorage.getItem('dock-snap') ?? 'true') === 'true')
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [activeTab, setActiveTab] = useState(initialTab)
  useEffect(() => { setActiveTab(initialTab) }, [initialTab])

  const resetToDefaults = () => {
    setTheme('light')
    setColorScheme('blue')
    setColorSaturation(100)
    setCustomTheme({ bg: '', text: '', button: '', panel: '' })
    setUiScale(100)
    setFontSize('standard')
    setBackgroundMode('solid')
    setBackgroundColor('#f5f7fb')
    setBackgroundGradient('linear-gradient(135deg, #cfe8ff, #f9f9ff)')
    setBackgroundImage('')
    setBackdropBlur(4)
    setTransparency(100)
    const root = document.documentElement
    const propsToRemove = ['--color-bg','--color-text','--panel-bg','--color-btn-bg','--color-btn-bg-hover','--font-family','--font-size','--font-weight','--border-radius','--ui-zoom','--transition','--backdrop-blur']
    propsToRemove.forEach(p => root.style.removeProperty(p))
    document.body.style.background = ''
    ;['color-scheme','color-saturation','custom-theme','ui-scale','font-size','bg-mode','bg-color','bg-gradient','bg-image','backdrop-blur','panel-transparency'].forEach(k => localStorage.removeItem(k))
  }

  // appearance
  const [colorScheme, setColorScheme] = useState(() => localStorage.getItem('color-scheme') || 'blue')
  const [colorSaturation, setColorSaturation] = useState(() => Number(localStorage.getItem('color-saturation') || 100))
  const [customTheme, setCustomTheme] = useState(() => {
    const raw = localStorage.getItem('custom-theme')
    return raw ? JSON.parse(raw) : { bg: '', text: '', button: '', panel: '' }
  })
  const [uiScale, setUiScale] = useState(() => Number(localStorage.getItem('ui-scale') || 100))
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('font-size') || 'standard')
  const [backgroundMode, setBackgroundMode] = useState(() => localStorage.getItem('bg-mode') || 'solid')
  const [backgroundColor, setBackgroundColor] = useState(() => localStorage.getItem('bg-color') || '#f5f7fb')
  const [backgroundGradient, setBackgroundGradient] = useState(() => localStorage.getItem('bg-gradient') || 'linear-gradient(135deg, #cfe8ff, #f9f9ff)')
  const [backgroundImage, setBackgroundImage] = useState(() => localStorage.getItem('bg-image') || '')
  const [backdropBlur, setBackdropBlur] = useState(() => Number(localStorage.getItem('backdrop-blur') || 4))
  const [transparency, setTransparency] = useState(() => Number(localStorage.getItem('panel-transparency') || 100))

  // dock
  const [dockPosition, setDockPosition] = useState(() => localStorage.getItem('dock-edge') || 'bottom')

  // notifications
  const [notifEnabled, setNotifEnabled] = useState(() => (localStorage.getItem('pref-notif-enabled') ?? 'true') === 'true')
  const [notifSoundEnabled, setNotifSoundEnabled] = useState(() => (localStorage.getItem('pref-notif-sound') ?? 'true') === 'true')
  const [notifOnlyFavorites, setNotifOnlyFavorites] = useState(() => (localStorage.getItem('pref-notif-only-favs') ?? 'false') === 'true')
  const [notifBanners, setNotifBanners] = useState(() => (localStorage.getItem('pref-notif-banners') ?? 'true') === 'true')
  const [notifToasts, setNotifToasts] = useState(() => (localStorage.getItem('pref-notif-toasts') ?? 'true') === 'true')
  const [notifPreview, setNotifPreview] = useState(() => (localStorage.getItem('pref-notif-preview') ?? 'true') === 'true')
  const [showUnreadBadge, setShowUnreadBadge] = useState(() => (localStorage.getItem('pref-unread-badge') ?? 'true') === 'true')

  // account
  const [privacyMsg, setPrivacyMsg] = useState(() => localStorage.getItem('pref-privacy-msg') || 'all')
  const [privacyProfile, setPrivacyProfile] = useState(() => localStorage.getItem('pref-privacy-profile') || 'all')
  const [privacyOnline, setPrivacyOnline] = useState(() => localStorage.getItem('pref-privacy-online') || 'friends')
  const [privacyMention, setPrivacyMention] = useState(() => localStorage.getItem('pref-privacy-mention') || 'all')
  const [privacyInvites, setPrivacyInvites] = useState(() => localStorage.getItem('pref-privacy-invites') || 'friends')
  const [syncDevices, setSyncDevices] = useState(() => (localStorage.getItem('pref-sync-devices') ?? 'true') === 'true')

  // chat
  const [chatSort, setChatSort] = useState(() => localStorage.getItem('pref-chat-sort') || 'date')
  const [confirmDelete, setConfirmDelete] = useState(() => (localStorage.getItem('pref-chat-confirm-delete') ?? 'true') === 'true')
  const [autoDeleteTimer, setAutoDeleteTimer] = useState(() => Number(localStorage.getItem('pref-chat-auto-delete') || 0))
  const [chatAutoPlayMedia, setChatAutoPlayMedia] = useState(() => (localStorage.getItem('pref-chat-autoplay') ?? 'false') === 'true')
  const [showSendTime, setShowSendTime] = useState(() => (localStorage.getItem('pref-chat-show-time') ?? 'true') === 'true')
  const [showTypingIndicator, setShowTypingIndicator] = useState(() => (localStorage.getItem('pref-chat-typing') ?? 'true') === 'true')
  const [showDeliveryStatus, setShowDeliveryStatus] = useState(() => (localStorage.getItem('pref-chat-delivery') ?? 'true') === 'true')

  // search
  const [globalSearch, setGlobalSearch] = useState(() => (localStorage.getItem('pref-search-global') ?? 'true') === 'true')
  const [searchMessages, setSearchMessages] = useState(() => (localStorage.getItem('pref-search-messages') ?? 'true') === 'true')
  const [searchUsers, setSearchUsers] = useState(() => (localStorage.getItem('pref-search-users') ?? 'true') === 'true')
  const [searchHashtags, setSearchHashtags] = useState(() => (localStorage.getItem('pref-search-hashtags') ?? 'true') === 'true')
  const [filterDate, setFilterDate] = useState(() => (localStorage.getItem('pref-search-filter-date') ?? 'false') === 'true')
  const [filterType, setFilterType] = useState(() => (localStorage.getItem('pref-search-filter-type') ?? 'false') === 'true')
  const [filterAuthor, setFilterAuthor] = useState(() => (localStorage.getItem('pref-search-filter-author') ?? 'false') === 'true')
  const [savedQueries, setSavedQueries] = useState(() => (localStorage.getItem('pref-search-saved') ?? 'true') === 'true')

  // media
  const [imageQuality, setImageQuality] = useState(() => localStorage.getItem('pref-media-image-quality') || 'high')
  const [autoCompressImages, setAutoCompressImages] = useState(() => (localStorage.getItem('pref-media-auto-compress') ?? 'false') === 'true')
  const [autoPlayVideo, setAutoPlayVideo] = useState(() => (localStorage.getItem('pref-media-autoplay-video') ?? 'false') === 'true')
  const [autoDownload, setAutoDownload] = useState(() => localStorage.getItem('pref-media-autodownload') || 'wifi')
  const [downloadFolder, setDownloadFolder] = useState(() => localStorage.getItem('pref-media-folder') || '')

  // security
  const [loginAlerts, setLoginAlerts] = useState(() => (localStorage.getItem('pref-sec-login-alerts') ?? 'true') === 'true')
  const [manageSessions, setManageSessions] = useState(() => (localStorage.getItem('pref-sec-sessions') ?? 'true') === 'true')
  const [trustedDevices, setTrustedDevices] = useState(() => (localStorage.getItem('pref-sec-trusted') ?? 'false') === 'true')
  const [activityLog, setActivityLog] = useState(() => (localStorage.getItem('pref-sec-activity') ?? 'true') === 'true')

  // effects
  useApplyTheme(theme)
  useLocalStoragePersist([['theme', theme]], [theme])
  useApplyPrimaryColor(colorScheme, colorSaturation)
  useLocalStoragePersist([
    ['color-scheme', colorScheme],
    ['color-saturation', colorSaturation, String],
  ], [colorScheme, colorSaturation])
  useApplyCustomTheme(customTheme)
  useLocalStoragePersist([['custom-theme', customTheme, (v)=>JSON.stringify(v)]], [customTheme])
  useApplyTypography(uiScale, fontSize)
  useLocalStoragePersist([
    ['ui-scale', uiScale, String],
    ['font-size', fontSize],
  ], [uiScale, fontSize])
  useApplyBackground(backgroundMode, backgroundColor, backgroundGradient, backgroundImage, backdropBlur, transparency)
  useLocalStoragePersist([
    ['bg-mode', backgroundMode],
    ['bg-color', backgroundColor],
    ['bg-gradient', backgroundGradient],
    ['bg-image', backgroundImage],
    ['backdrop-blur', backdropBlur, String],
    ['panel-transparency', transparency, String],
  ], [backgroundMode, backgroundColor, backgroundGradient, backgroundImage, backdropBlur, transparency])

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])


  useLocalStoragePersist([
    ['pref-notif-enabled', notifEnabled, String],
    ['pref-notif-sound', notifSoundEnabled, String],
    ['pref-notif-only-favs', notifOnlyFavorites, String],
    ['pref-notif-banners', notifBanners, String],
    ['pref-notif-toasts', notifToasts, String],
    ['pref-notif-preview', notifPreview, String],
    ['pref-unread-badge', showUnreadBadge, String],
  ], [notifEnabled, notifSoundEnabled, notifOnlyFavorites, notifBanners, notifToasts, notifPreview, showUnreadBadge])

  useLocalStoragePersist([
    ['pref-privacy-msg', privacyMsg],
    ['pref-privacy-profile', privacyProfile],
    ['pref-privacy-online', privacyOnline],
    ['pref-privacy-mention', privacyMention],
    ['pref-privacy-invites', privacyInvites],
    ['pref-sync-devices', syncDevices, String],
  ], [privacyMsg, privacyProfile, privacyOnline, privacyMention, privacyInvites, syncDevices])

  useLocalStoragePersist([
    ['pref-chat-sort', chatSort],
    ['pref-chat-confirm-delete', confirmDelete, String],
    ['pref-chat-auto-delete', autoDeleteTimer, String],
    ['pref-chat-autoplay', chatAutoPlayMedia, String],
    ['pref-chat-show-time', showSendTime, String],
    ['pref-chat-typing', showTypingIndicator, String],
    ['pref-chat-delivery', showDeliveryStatus, String],
  ], [chatSort, confirmDelete, autoDeleteTimer, chatAutoPlayMedia, showSendTime, showTypingIndicator, showDeliveryStatus])

  useLocalStoragePersist([
    ['pref-search-global', globalSearch, String],
    ['pref-search-messages', searchMessages, String],
    ['pref-search-users', searchUsers, String],
    ['pref-search-hashtags', searchHashtags, String],
    ['pref-search-filter-date', filterDate, String],
    ['pref-search-filter-type', filterType, String],
    ['pref-search-filter-author', filterAuthor, String],
    ['pref-search-saved', savedQueries, String],
  ], [globalSearch, searchMessages, searchUsers, searchHashtags, filterDate, filterType, filterAuthor, savedQueries])

  useLocalStoragePersist([
    ['pref-media-image-quality', imageQuality],
    ['pref-media-auto-compress', autoCompressImages, String],
    ['pref-media-autoplay-video', autoPlayVideo, String],
    ['pref-media-autodownload', autoDownload],
    ['pref-media-folder', downloadFolder],
  ], [imageQuality, autoCompressImages, autoPlayVideo, autoDownload, downloadFolder])

  useLocalStoragePersist([
    ['pref-sec-login-alerts', loginAlerts, String],
    ['pref-sec-sessions', manageSessions, String],
    ['pref-sec-trusted', trustedDevices, String],
    ['pref-sec-activity', activityLog, String],
  ], [loginAlerts, manageSessions, trustedDevices, activityLog])

  const handleBackdrop = (e) => {
    if (e.target.classList.contains('custom-modal-backdrop')) onClose()
  }

  const handleToggleSnap = (checked) => {
    setSnapEnabled(checked)
    localStorage.setItem('dock-snap', String(checked))
    window.dispatchEvent(new CustomEvent('dock-snap-changed', { detail: { enabled: checked } }))
  }

  const handleResetDock = () => {
    localStorage.removeItem('dock-position')
    window.dispatchEvent(new Event('reset-dock-position'))
  }

  const handleSetDockPosition = (pos) => {
    setDockPosition(pos)
    localStorage.setItem('dock-edge', pos)
    window.dispatchEvent(new CustomEvent('dock-edge-changed', { detail: { position: pos } }))
  }

  const getPressedStyle = (isPressed) => (isPressed ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' } : {})

  return {
    // refs
    containerRef,
    // ui
    activeTab,
    setActiveTab,
    singleMode,
    handleBackdrop,
    resetToDefaults,
    getPressedStyle,
    // appearance
    theme, setTheme,
    colorScheme, setColorScheme,
    colorSaturation, setColorSaturation,
    customTheme, setCustomTheme,
    uiScale, setUiScale,
    fontSize, setFontSize,
    backgroundMode, setBackgroundMode,
    backgroundColor, setBackgroundColor,
    backgroundGradient, setBackgroundGradient,
    backgroundImage, setBackgroundImage,
    backdropBlur, setBackdropBlur,
    transparency, setTransparency,
    // dock
    snapEnabled, handleToggleSnap,
    dockPosition, handleSetDockPosition, handleResetDock,
    // notifications
    notifEnabled, setNotifEnabled,
    notifSoundEnabled, setNotifSoundEnabled,
    notifOnlyFavorites, setNotifOnlyFavorites,
    notifBanners, setNotifBanners,
    notifToasts, setNotifToasts,
    notifPreview, setNotifPreview,
    showUnreadBadge, setShowUnreadBadge,
    // account
    privacyMsg, setPrivacyMsg,
    privacyProfile, setPrivacyProfile,
    privacyOnline, setPrivacyOnline,
    privacyMention, setPrivacyMention,
    privacyInvites, setPrivacyInvites,
    syncDevices, setSyncDevices,
    // chat
    chatSort, setChatSort,
    confirmDelete, setConfirmDelete,
    autoDeleteTimer, setAutoDeleteTimer,
    chatAutoPlayMedia, setChatAutoPlayMedia,
    showSendTime, setShowSendTime,
    showTypingIndicator, setShowTypingIndicator,
    showDeliveryStatus, setShowDeliveryStatus,
    // search
    globalSearch, setGlobalSearch,
    searchMessages, setSearchMessages,
    searchUsers, setSearchUsers,
    searchHashtags, setSearchHashtags,
    filterDate, setFilterDate,
    filterType, setFilterType,
    filterAuthor, setFilterAuthor,
    savedQueries, setSavedQueries,
    // media
    imageQuality, setImageQuality,
    autoCompressImages, setAutoCompressImages,
    autoPlayVideo, setAutoPlayVideo,
    autoDownload, setAutoDownload,
    downloadFolder, setDownloadFolder,
    // security
    loginAlerts, setLoginAlerts,
    manageSessions, setManageSessions,
    trustedDevices, setTrustedDevices,
    activityLog, setActivityLog,
  }
}
