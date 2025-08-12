import React from 'react'

const NotificationsSection = ({
  notifEnabled,
  setNotifEnabled,
  notifSoundEnabled,
  setNotifSoundEnabled,
  notifOnlyFavorites,
  setNotifOnlyFavorites,
  notifBanners,
  setNotifBanners,
  notifToasts,
  setNotifToasts,
  notifPreview,
  setNotifPreview,
  showUnreadBadge,
  setShowUnreadBadge,
}) => {
  return (
    <div style={{ display:'grid', gap:10 }}>
      <div style={{ fontWeight:700 }}>Уведомления</div>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={notifEnabled} onChange={(e)=> setNotifEnabled(e.target.checked)} />
        <span>Включить уведомления</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={notifSoundEnabled} onChange={(e)=> setNotifSoundEnabled(e.target.checked)} />
        <span>Звук уведомлений</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={notifOnlyFavorites} onChange={(e)=> setNotifOnlyFavorites(e.target.checked)} />
        <span>Только от избранных</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={notifBanners} onChange={(e)=> setNotifBanners(e.target.checked)} />
        <span>Баннеры уведомлений</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={notifToasts} onChange={(e)=> setNotifToasts(e.target.checked)} />
        <span>Всплывающие уведомления</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={notifPreview} onChange={(e)=> setNotifPreview(e.target.checked)} />
        <span>Предпросмотр сообщений</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={showUnreadBadge} onChange={(e)=> setShowUnreadBadge(e.target.checked)} />
        <span>Показывать счетчик на иконке</span>
      </label>
    </div>
  )
}

export default NotificationsSection


