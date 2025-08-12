import React from 'react'

const AccountSection = ({
  privacyMsg,
  setPrivacyMsg,
  privacyProfile,
  setPrivacyProfile,
  privacyOnline,
  setPrivacyOnline,
  privacyMention,
  setPrivacyMention,
  privacyInvites,
  setPrivacyInvites,
  syncDevices,
  setSyncDevices,
}) => {
  return (
    <div style={{ display:'grid', gap:10 }}>
      <div style={{ fontWeight:700 }}>Аккаунт</div>
      <div style={{ display:'grid', gap:6 }}>
        <span>Приватность</span>
        <label style={{ display:'grid' }}>
          <span>Кто может писать сообщения</span>
          <select value={privacyMsg} onChange={(e)=> setPrivacyMsg(e.target.value)}>
            <option value="all">Все</option>
            <option value="friends">Друзья</option>
            <option value="nobody">Никто</option>
          </select>
        </label>
        <label style={{ display:'grid' }}>
          <span>Кто видит профиль</span>
          <select value={privacyProfile} onChange={(e)=> setPrivacyProfile(e.target.value)}>
            <option value="all">Все</option>
            <option value="friends">Друзья</option>
            <option value="nobody">Никто</option>
          </select>
        </label>
        <label style={{ display:'grid' }}>
          <span>Кто видит онлайн</span>
          <select value={privacyOnline} onChange={(e)=> setPrivacyOnline(e.target.value)}>
            <option value="all">Все</option>
            <option value="friends">Друзья</option>
            <option value="nobody">Никто</option>
          </select>
        </label>
        <label style={{ display:'grid' }}>
          <span>Кто может упоминать</span>
          <select value={privacyMention} onChange={(e)=> setPrivacyMention(e.target.value)}>
            <option value="all">Все</option>
            <option value="friends">Друзья</option>
            <option value="nobody">Никто</option>
          </select>
        </label>
        <label style={{ display:'grid' }}>
          <span>Кто может приглашать в группы</span>
          <select value={privacyInvites} onChange={(e)=> setPrivacyInvites(e.target.value)}>
            <option value="all">Все</option>
            <option value="friends">Друзья</option>
            <option value="nobody">Никто</option>
          </select>
        </label>
      </div>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={syncDevices} onChange={(e)=> setSyncDevices(e.target.checked)} />
        <span>Синхронизация между устройствами</span>
      </label>
      <div style={{ color:'var(--color-text-secondary)' }}>
        Смена логина/пароля/почты, 2FA, соц. логины, экспорт/удаление/деактивация аккаунта — добавлю при интеграции API.
      </div>
    </div>
  )
}

export default AccountSection


