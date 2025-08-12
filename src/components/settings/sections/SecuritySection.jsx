import React from 'react'

const SecuritySection = ({
  loginAlerts,
  setLoginAlerts,
  manageSessions,
  setManageSessions,
  trustedDevices,
  setTrustedDevices,
  activityLog,
  setActivityLog,
  getPressedStyle,
}) => {
  return (
    <div style={{ display:'grid', gap:10 }}>
      <div style={{ fontWeight:700 }}>Безопасность</div>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={loginAlerts} onChange={(e)=> setLoginAlerts(e.target.checked)} />
        <span>Уведомления о входе с нового устройства</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={manageSessions} onChange={(e)=> setManageSessions(e.target.checked)} />
        <span>Управление активными сессиями</span>
      </label>
      <div style={{ display:'grid', gap:6 }}>
        <span>Доверенные устройства</span>
        <button
          type="button"
          className="custom-modal-btn"
          onClick={() => setTrustedDevices(!trustedDevices)}
          aria-pressed={trustedDevices}
          style={{ width:'100%', justifyContent:'center', ...getPressedStyle(trustedDevices) }}
        >
          {trustedDevices ? 'Включено' : 'Выключено'}
        </button>
      </div>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={activityLog} onChange={(e)=> setActivityLog(e.target.checked)} />
        <span>Журнал активности</span>
      </label>
    </div>
  )
}

export default SecuritySection


