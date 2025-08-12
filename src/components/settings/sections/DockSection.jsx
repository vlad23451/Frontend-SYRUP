import React from 'react'

const DockSection = ({
  snapEnabled,
  handleToggleSnap,
  dockPosition,
  handleSetDockPosition,
  handleResetDock,
  getPressedStyle,
}) => {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 600 }}>Привязка дока к краям</div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Автоматически прилипать к краям экрана</div>
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, userSelect: 'none', cursor: 'pointer', ...getPressedStyle(snapEnabled) }}>
          <input
            type="checkbox"
            checked={snapEnabled}
            onChange={(e) => handleToggleSnap(e.target.checked)}
          />
          <span>{snapEnabled ? 'Вкл' : 'Выкл'}</span>
        </label>
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        <div style={{ fontWeight: 600 }}>Позиция дока</div>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { k: 'top', label: 'Сверху' },
            { k: 'bottom', label: 'Снизу' },
            { k: 'left', label: 'Слева' },
            { k: 'right', label: 'Справа' },
          ].map(({ k, label }) => (
            <button
              key={k}
              type="button"
              className="custom-modal-btn"
              onClick={() => handleSetDockPosition(k)}
              aria-pressed={dockPosition === k}
              style={{ justifyContent: 'center', ...getPressedStyle(dockPosition === k) }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" className="custom-modal-btn cancel" onClick={handleResetDock}>
          Сбросить позицию дока
        </button>
      </div>
    </div>
  )
}

export default DockSection


