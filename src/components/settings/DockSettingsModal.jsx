import React, { useEffect, useMemo, useRef, useState } from 'react'
import ModalHeader from '../ui/ModalHeader'

const DockSettingsModal = ({ open, onClose }) => {
  const containerRef = useRef(null)
  const grabRef = useRef(null)

  const [orientation, setOrientation] = useState(localStorage.getItem('dock-orientation') || 'horizontal') 
  const [align, setAlign] = useState(localStorage.getItem('dock-align') || 'center') 
  const [autoAlign, setAutoAlign] = useState((localStorage.getItem('dock-auto-align') ?? 'true') === 'true')
  const [size, setSize] = useState(Number(localStorage.getItem('dock-size') || 1)) 
  const [iconPreset, setIconPreset] = useState(localStorage.getItem('dock-icon-preset') || 'medium') 
  const [autoFit, setAutoFit] = useState((localStorage.getItem('dock-auto-fit') ?? 'false') === 'true')
  const [bgType, setBgType] = useState(localStorage.getItem('dock-bg-type') || 'frosted') 
  const [bg, setBg] = useState(localStorage.getItem('dock-bg') || 'rgba(255,255,255,0.65)')
  const [blur, setBlur] = useState(Number(localStorage.getItem('dock-blur') || 16))
  const [radius, setRadius] = useState(Number(localStorage.getItem('dock-radius-val') || 20))
  const [shadowMode, setShadowMode] = useState(localStorage.getItem('dock-shadow') || 'default') 
  const [hoverScale, setHoverScale] = useState(Number(localStorage.getItem('dock-hover-scale') || 1.15))
  const [animSpeed, setAnimSpeed] = useState(Number(localStorage.getItem('dock-anim-speed') || 200))
  const [autoHide, setAutoHide] = useState((localStorage.getItem('dock-auto-hide') ?? 'false') === 'true')
  const [showOnHover, setShowOnHover] = useState((localStorage.getItem('dock-show-on-hover') ?? 'false') === 'true')
  const [onTop, setOnTop] = useState((localStorage.getItem('dock-on-top') ?? 'false') === 'true')
  const [hideLabels, setHideLabels] = useState((localStorage.getItem('dock-hide-labels') ?? 'false') === 'true')
  const [labelSize, setLabelSize] = useState(Number(localStorage.getItem('dock-label-size') || 12))
  const [iconStyle, setIconStyle] = useState(localStorage.getItem('dock-icon-style') || 'flat') 

  const iconSize = useMemo(() => ({ small: 22, medium: 28, large: 34 }[iconPreset] || 28), [iconPreset])
  const [activeSection, setActiveSection] = useState(null) 
  const [activeIndicator, setActiveIndicator] = useState(localStorage.getItem('dock-active-indicator') || 'dot')
  const [notifyIndicator, setNotifyIndicator] = useState(localStorage.getItem('dock-notify-indicator') || 'number')
  const [soundEnabled, setSoundEnabled] = useState((localStorage.getItem('dock-sound') ?? 'false') === 'true')
  const [hotkeysEnabled, setHotkeysEnabled] = useState((localStorage.getItem('dock-hotkeys') ?? 'true') === 'true')
  const [adaptiveSize, setAdaptiveSize] = useState((localStorage.getItem('dock-adaptive-size') ?? 'true') === 'true')
  const [order, setOrder] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dock-order') || '[]')
      if (Array.isArray(saved) && saved.length) return saved
    } catch {}
    return ['home','people','messenger','profile']
  })
  const [separators, setSeparators] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dock-separators') || '[]') } catch { return [] }
  })
  const [dragIndex, setDragIndex] = useState(null)

  useEffect(() => {
    const dock = document.querySelector('.dock')
    if (!dock) return
    dock.classList.toggle('vertical', orientation !== 'horizontal')
    const root = document.documentElement
    const effIcon = Math.round(iconSize * size)
    root.style.setProperty('--dock-icon-size', `${effIcon}px`)
    root.style.setProperty('--dock-blur', `${blur}px`)
    root.style.setProperty('--dock-radius', `${radius}px`)
    root.style.setProperty('--dock-label-size', `${labelSize}px`)
    root.style.setProperty('--dock-hover-scale', String(hoverScale))
    root.style.setProperty('--transition', `${animSpeed}ms ease`)
    if (bgType === 'solid') root.style.setProperty('--dock-bg', bg)
    if (bgType === 'transparent') root.style.setProperty('--dock-bg', 'transparent')
    if (bgType === 'frosted') root.style.setProperty('--dock-bg', 'rgba(255,255,255,0.65)')
    dock.classList.toggle('shadow-none', shadowMode === 'none')
    dock.classList.toggle('shadow-soft', shadowMode === 'soft')
    dock.classList.toggle('shadow-sharp', shadowMode === 'sharp')
    dock.classList.toggle('on-top', onTop)
    dock.classList.toggle('auto-hide', autoHide)
    dock.classList.toggle('hide-labels', hideLabels)
    dock.classList.toggle('active-indicator-dot', activeIndicator === 'dot')
    dock.classList.toggle('active-indicator-highlight', activeIndicator === 'highlight')
    dock.classList.toggle('active-indicator-none', activeIndicator === 'none')
    dock.classList.toggle('notify-indicator-number', notifyIndicator === 'number')
    dock.classList.toggle('notify-indicator-dot', notifyIndicator === 'dot')
    dock.classList.toggle('notify-indicator-anim', notifyIndicator === 'anim')
    window.dispatchEvent(new Event('dock-settings-updated'))
  }, [orientation, iconSize, size, blur, radius, labelSize, hoverScale, animSpeed, bgType, bg, shadowMode, onTop, autoHide, hideLabels, activeIndicator, notifyIndicator])

  useEffect(() => {
    localStorage.setItem('dock-orientation', orientation)
    localStorage.setItem('dock-align', align)
    localStorage.setItem('dock-auto-align', String(autoAlign))
    localStorage.setItem('dock-icon-preset', iconPreset)
    localStorage.setItem('dock-auto-fit', String(autoFit))
    localStorage.setItem('dock-bg-type', bgType)
    localStorage.setItem('dock-bg', bg)
    localStorage.setItem('dock-blur', String(blur))
    localStorage.setItem('dock-radius-val', String(radius))
    localStorage.setItem('dock-shadow', shadowMode)
    localStorage.setItem('dock-hover-scale', String(hoverScale))
    localStorage.setItem('dock-anim-speed', String(animSpeed))
    localStorage.setItem('dock-auto-hide', String(autoHide))
    localStorage.setItem('dock-show-on-hover', String(showOnHover))
    localStorage.setItem('dock-on-top', String(onTop))
    localStorage.setItem('dock-hide-labels', String(hideLabels))
    localStorage.setItem('dock-label-size', String(labelSize))
    localStorage.setItem('dock-icon-style', iconStyle)
    localStorage.setItem('dock-active-indicator', activeIndicator)
    localStorage.setItem('dock-notify-indicator', notifyIndicator)
    localStorage.setItem('dock-sound', String(soundEnabled))
    localStorage.setItem('dock-hotkeys', String(hotkeysEnabled))
    localStorage.setItem('dock-adaptive-size', String(adaptiveSize))
    localStorage.setItem('dock-order', JSON.stringify(order))
    localStorage.setItem('dock-separators', JSON.stringify(separators))
  }, [orientation, align, autoAlign, iconPreset, autoFit, bgType, bg, blur, radius, shadowMode, hoverScale, animSpeed, autoHide, showOnHover, onTop, hideLabels, labelSize, iconStyle, activeIndicator, notifyIndicator, soundEnabled, hotkeysEnabled, adaptiveSize, order, separators])

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  useEffect(() => {
    const handle = grabRef.current
    const container = containerRef.current
    if (!open || !handle || !container) return
    let isDragging = false
    let startX = 0, startY = 0, startLeft = 0, startTop = 0
    const onDown = (e) => { isDragging = true; handle.setPointerCapture(e.pointerId); startX = e.clientX; startY = e.clientY; const r = container.getBoundingClientRect(); startLeft = r.left; startTop = r.top; handle.style.cursor = 'grabbing' }
    const onMove = (e) => { if (!isDragging) return; const dx = e.clientX - startX; const dy = e.clientY - startY; const vw = window.innerWidth; const vh = window.innerHeight; const r = container.getBoundingClientRect(); const newLeft = Math.max(8, Math.min(vw - r.width - 8, startLeft + dx)); const newTop = Math.max(8, Math.min(vh - r.height - 8, startTop + dy)); container.style.left = newLeft+'px'; container.style.top = newTop+'px'; container.style.position='fixed'; container.style.margin='0'; container.style.transform='none' }
    const onUp = (e) => { isDragging = false; try { handle.releasePointerCapture(e.pointerId) } catch {}; handle.style.cursor = 'grab' }
    handle.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => { handle.removeEventListener('pointerdown', onDown); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp) }
  }, [open])

  if (!open) return null

  const handleBackdrop = (e) => { if (e.target.classList.contains('custom-modal-backdrop')) onClose() }

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdrop}>
      <div className="custom-modal-wrapper" ref={containerRef}>
        <div className="custom-modal" style={{ maxWidth: 340, width: '95vw', maxHeight: '70vh' }}>
          <ModalHeader title="Настройки дока" onClose={onClose} hideClose />
          {activeSection && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button className="custom-modal-btn cancel" onClick={() => setActiveSection(null)}>Назад</button>
            </div>
          )}
          <div className="custom-modal-content" style={{ display: 'grid', gap: 10, overflowY: 'auto', paddingTop: 2, paddingBottom: 2, maxHeight: 'calc(70vh - 96px)' }}>
            {!activeSection && (
              <div style={{ display: 'grid', gap: 8 }}>
                {[
                  { key: 'position', label: 'Позиция и ориентация' },
                  { key: 'sizes', label: 'Размеры' },
                  { key: 'style', label: 'Стиль и оформление' },
                  { key: 'behavior', label: 'Поведение' },
                  { key: 'icons', label: 'Иконки' },
                  { key: 'indicators', label: 'Индикаторы' },
                  { key: 'extra', label: 'Дополнительно' },
                ].map(({ key, label }, idx, arr) => (
                  <button
                    key={key}
                    className="custom-modal-btn"
                    onClick={() => setActiveSection(key)}
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: idx === 0 ? 2 : 0,
                      marginBottom: idx === arr.length - 1 ? 12 : 0,
                    }}
                  >
                    <span>{label}</span>
                    <span style={{ opacity: 0.6 }}>›</span>
                  </button>
                ))}
              </div>
            )}

            {activeSection === 'position' && (
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ fontWeight: 700 }}>Позиция и ориентация</div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <label>Расположение</label>
                  {[
                    { k: 'horizontal', label: 'Снизу' },
                    { k: 'left', label: 'Слева' },
                    { k: 'right', label: 'Справа' },
                  ].map(({ k, label }) => (
                    <button key={k} className="custom-modal-btn" onClick={() => setOrientation(k)} aria-pressed={orientation === k} style={{ width: '100%', justifyContent: 'center' }}>{label}</button>
                  ))}
                </div>
                {orientation !== 'horizontal' && (
                  <div style={{ display: 'grid', gap: 6 }}>
                    <label>Выравнивание</label>
                    {[
                      { k: 'start', label: 'Сверху' },
                      { k: 'center', label: 'По центру' },
                      { k: 'end', label: 'Снизу' },
                    ].map(({ k, label }) => (
                      <button key={k} className="custom-modal-btn" onClick={() => setAlign(k)} aria-pressed={align === k} style={{ width: '100%', justifyContent: 'center' }}>{label}</button>
                    ))}
                  </div>
                )}
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={autoAlign} onChange={(e)=> setAutoAlign(e.target.checked)} />
                  <span>Автоматическое выравнивание</span>
                </label>
              </div>
            )}

            {activeSection === 'sizes' && (
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ fontWeight: 700 }}>Размеры</div>
                <label style={{ display: 'grid', gap: 4 }}>
                  <span>Высота/ширина дока</span>
                  <input type="range" min="0.8" max="1.6" step="0.05" value={size} onChange={(e)=> setSize(Number(e.target.value))} />
                </label>
                <div style={{ display: 'grid', gap: 6 }}>
                  <span>Размер иконок</span>
                  {['small','medium','large'].map(k => (
                    <button key={k} className="custom-modal-btn" onClick={()=> setIconPreset(k)} aria-pressed={iconPreset === k} style={{ width: '100%', justifyContent: 'center' }}>{k}</button>
                  ))}
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={autoFit} onChange={(e)=> setAutoFit(e.target.checked)} />
                  <span>Автоподгонка под количество иконок</span>
                </label>
              </div>
            )}

            {activeSection === 'style' && (
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ fontWeight: 700 }}>Стиль и оформление</div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <span>Фон дока</span>
                  {[
                    {k:'solid',label:'Сплошной цвет'},
                    {k:'frosted',label:'Размытие'},
                    {k:'transparent',label:'Прозрачный'},
                  ].map(({k,label}) => (
                    <button key={k} className="custom-modal-btn" onClick={()=> setBgType(k)} aria-pressed={bgType===k} style={{ width:'100%', justifyContent:'center' }}>{label}</button>
                  ))}
                  {bgType==='solid' && (
                    <label style={{ display:'grid', gap:4 }}>
                      <span>Цвет</span>
                      <input type="color" value={bg} onChange={(e)=> setBg(e.target.value)} />
                    </label>
                  )}
                </div>
                <label style={{ display: 'grid', gap: 4 }}>
                  <span>Размытие</span>
                  <input type="range" min="0" max="32" step="1" value={blur} onChange={(e)=> setBlur(Number(e.target.value))} />
                </label>
                <label style={{ display: 'grid', gap: 4 }}>
                  <span>Закруглённость</span>
                  <input type="range" min="0" max="28" step="1" value={radius} onChange={(e)=> setRadius(Number(e.target.value))} />
                </label>
                <div style={{ display: 'grid', gap: 6 }}>
                  <span>Тени</span>
                  {[
                    {k:'default',label:'С тенью'},
                    {k:'soft',label:'Мягкая'},
                    {k:'sharp',label:'Резкая'},
                    {k:'none',label:'Без тени'},
                  ].map(({k,label}) => (
                    <button key={k} className="custom-modal-btn" onClick={()=> setShadowMode(k)} aria-pressed={shadowMode===k} style={{ width:'100%', justifyContent:'center' }}>{label}</button>
                  ))}
                </div>
                <label style={{ display:'grid', gap:4 }}>
                  <span>Увеличение иконки при наведении</span>
                  <input type="range" min="1" max="1.6" step="0.05" value={hoverScale} onChange={(e)=> setHoverScale(Number(e.target.value))} />
                </label>
                <label style={{ display:'grid', gap:4 }}>
                  <span>Плавность анимаций (мс)</span>
                  <input type="range" min="50" max="600" step="10" value={animSpeed} onChange={(e)=> setAnimSpeed(Number(e.target.value))} />
                </label>
              </div>
            )}

            {activeSection === 'behavior' && (
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ fontWeight: 700 }}>Поведение</div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={autoHide} onChange={(e)=> setAutoHide(e.target.checked)} />
                  <span>Автоматическое скрытие</span>
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={showOnHover} onChange={(e)=> setShowOnHover(e.target.checked)} />
                  <span>Появление при наведении</span>
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={onTop} onChange={(e)=> setOnTop(e.target.checked)} />
                  <span>Закрепить поверх всего</span>
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={hideLabels} onChange={(e)=> setHideLabels(e.target.checked)} />
                  <span>Скрыть подписи</span>
                </label>
                <label style={{ display:'grid', gap:4 }}>
                  <span>Размер подписи</span>
                  <input type="range" min="10" max="16" step="1" value={labelSize} onChange={(e)=> setLabelSize(Number(e.target.value))} />
                </label>
              </div>
            )}

            {activeSection === 'icons' && (
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ fontWeight: 700 }}>Иконки</div>
                <div style={{ display: 'grid', gap: 6 }}>
                  {[
                    {k:'flat', label:'Плоские'},
                    {k:'skeuo', label:'Объёмные'},
                    {k:'min', label:'Минималистичные'},
                  ].map(({k,label}) => (
                    <button key={k} className="custom-modal-btn" onClick={()=> setIconStyle(k)} aria-pressed={iconStyle===k} style={{ width:'100%', justifyContent:'center' }}>{label}</button>
                  ))}
                </div>
                <div style={{ display:'grid', gap:8 }}>
                  <div style={{ fontWeight: 600 }}>Порядок и группировка</div>
                  <ul style={{ listStyle:'none', margin:0, padding:0, display:'grid', gap:6 }}>
                    {order.map((key, idx) => (
                      <li key={key}
                          draggable
                          onDragStart={() => setDragIndex(idx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (dragIndex == null || dragIndex === idx) return
                            const next = order.slice()
                            const [moved] = next.splice(dragIndex,1)
                            next.splice(idx,0,moved)
                            setOrder(next)
                            setDragIndex(null)
                          }}
                          className="custom-modal-btn"
                          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', cursor:'grab' }}>
                        <span>{({home:'Истории',people:'Люди',messenger:'Чаты',profile:'Профиль'})[key]||key}</span>
                        <span style={{ opacity:0.6 }}>⇅</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ display:'grid', gap:6 }}>
                    <span>Разделители</span>
                    <div style={{ display:'grid', gap:6 }}>
                      {order.map((key, idx) => (
                        <label key={`sep-${idx}`} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'6px 8px', border:'1px dashed var(--color-border)', borderRadius:8 }}>
                          <span>Разделитель после «{({home:'Истории',people:'Люди',messenger:'Чаты',profile:'Профиль'})[key]||key}»</span>
                          <input type="checkbox" checked={separators.includes(idx)} onChange={(e)=> {
                            const next = new Set(separators)
                            if (e.target.checked) next.add(idx); else next.delete(idx)
                            setSeparators(Array.from(next).sort((a,b)=>a-b))
                          }} />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'indicators' && (
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ fontWeight: 700 }}>Индикаторы</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <span>Активное приложение</span>
                  {[
                    {k:'dot',label:'Точка'},
                    {k:'highlight',label:'Подсветка'},
                    {k:'none',label:'Ничего'},
                  ].map(({k,label}) => (
                    <button key={k} className="custom-modal-btn" onClick={()=> setActiveIndicator(k)} aria-pressed={activeIndicator===k} style={{ width:'100%', justifyContent:'center' }}>{label}</button>
                  ))}
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  <span>Уведомления</span>
                  {[
                    {k:'number',label:'Цифра'},
                    {k:'dot',label:'Красная точка'},
                    {k:'anim',label:'Анимация иконки'},
                  ].map(({k,label}) => (
                    <button key={k} className="custom-modal-btn" onClick={()=> setNotifyIndicator(k)} aria-pressed={notifyIndicator===k} style={{ width:'100%', justifyContent:'center' }}>{label}</button>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'extra' && (
              <div style={{ display: 'grid', gap: 10 }}>
                <div style={{ fontWeight: 700 }}>Дополнительно</div>
                <div style={{ display:'grid', gap:8 }}>
                  <div style={{ display:'grid', gap:6 }}>
                    <span>Пресеты</span>
                    <div style={{ display:'grid', gap:6 }}>
                      {[
                        {k:'mac',label:'macOS', apply:()=>{ setBgType('frosted'); setBlur(16); setRadius(18); setShadowMode('soft'); setHoverScale(1.15) }},
                        {k:'minimal',label:'Минимализм', apply:()=>{ setBgType('transparent'); setBlur(0); setRadius(14); setShadowMode('none'); setHoverScale(1.05) }},
                        {k:'neon',label:'Неон', apply:()=>{ setBgType('solid'); setBg('#0b1220cc'); setBlur(0); setRadius(20); setShadowMode('sharp'); setHoverScale(1.2) }},
                        {k:'retro',label:'Ретро', apply:()=>{ setBgType('solid'); setBg('#ffffff'); setBlur(0); setRadius(8); setShadowMode('soft'); setHoverScale(1.1) }},
                      ].map(({k,label,apply}) => (
                        <button key={k} className="custom-modal-btn" onClick={apply} style={{ width:'100%', justifyContent:'center' }}>{label}</button>
                      ))}
                    </div>
                  </div>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={soundEnabled} onChange={(e)=> setSoundEnabled(e.target.checked)} />
                    <span>Звук при открытии приложения</span>
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={hotkeysEnabled} onChange={(e)=> setHotkeysEnabled(e.target.checked)} />
                    <span>Горячие клавиши (Alt+1…)</span>
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={adaptiveSize} onChange={(e)=> setAdaptiveSize(e.target.checked)} />
                    <span>Адаптивный размер дока</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="modal-drag-handle bottom external" ref={grabRef} title="Переместить" />
        <div className="modal-drag-visible bottom external" />
      </div>
    </div>
  )
}

export default DockSettingsModal
