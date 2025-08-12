import React from 'react'

const AppearanceSection = ({
  theme,
  setTheme,
  colorScheme,
  setColorScheme,
  colorSaturation,
  setColorSaturation,
  fontSize,
  setFontSize,
  uiScale,
  setUiScale,
  transparency,
  setTransparency,
  getPressedStyle,
}) => {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ fontWeight: 700 }}>Темы</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {[{ key: 'light', label: 'Светлая' }, { key: 'dark', label: 'Тёмная' }].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className="custom-modal-btn"
              onClick={() => setTheme(key)}
              aria-pressed={theme === key}
              style={{
                width: '100%',
                justifyContent: 'center',
                ...(theme === key ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' } : {})
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ fontWeight: 700 }}>Акцентный цвет</div>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))' }}>
          {[
            { k: 'blue', v: '#3b82f6' },
            { k: 'blueDark', v: '#1e40af' },
            { k: 'purple', v: '#8b5cf6' },
            { k: 'purpleDark', v: '#5b21b6' },
            { k: 'yellow', v: '#eab308' },
            { k: 'orange', v: '#f97316' },
            { k: 'red', v: '#ef4444' },
          ].map(({ k, v }) => (
            <button
              key={k}
              type="button"
              onClick={() => setColorScheme(k)}
              aria-pressed={colorScheme === k}
              title={k}
              style={{
                width: '100%',
                height: 56,
                borderRadius: 10,
                border: colorScheme === k ? '2px solid var(--color-text)' : '1px solid var(--color-border)',
                background: v,
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Насыщенность: {colorSaturation}%</span>
          <input type="range" min="20" max="130" value={colorSaturation} onChange={(e) => setColorSaturation(Number(e.target.value))} style={{ accentColor: 'var(--color-primary)' }} />
        </label>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ fontWeight: 700 }}>Размер интерфейса</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            { key: 'small', label: 'Мелкий' },
            { key: 'standard', label: 'Стандартный' },
            { key: 'large', label: 'Крупный' },
          ].map(({ key, label }) => (
            <button key={key} type="button" className="custom-modal-btn" onClick={() => setFontSize(key)} aria-pressed={fontSize === key} style={{ width: '100%', justifyContent: 'center', ...(fontSize === key ? { borderColor: 'var(--color-primary)', color: 'var(--color-primary)' } : {}) }}>
              {label}
            </button>
          ))}
        </div>
        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Масштаб: {uiScale}%</span>
          <input type="range" min="75" max="175" step="5" value={uiScale} onChange={(e)=> setUiScale(Number(e.target.value))} style={{ accentColor: 'var(--color-primary)' }} />
        </label>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        <div style={{ fontWeight: 700 }}>Прозрачность элементов</div>
        <label style={{ display:'grid', gap:4 }}>
          <span style={{ color: 'var(--color-text-secondary)' }}>Панели/карточки/док: {transparency}%</span>
          <input type="range" min="20" max="100" step="5" value={transparency} onChange={(e)=> setTransparency(Number(e.target.value))} style={{ accentColor: 'var(--color-primary)' }} />
        </label>
      </div>
    </div>
  )
}

export default AppearanceSection
