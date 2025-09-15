import { useEffect } from 'react'

export function useApplyTheme(theme) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
}

export function useApplyPrimaryColor(colorScheme, colorSaturation) {
  useEffect(() => {
    const root = document.documentElement

    const basePrimary = ({
      blue: [59, 130, 246],
      blueDark: [30, 64, 175],
      yellow: [234, 179, 8],
      purple: [139, 92, 246],
      purpleDark: [91, 33, 182],
      red: [239, 68, 68],
      orange: [249, 115, 22],
    }[colorScheme]) || [59, 130, 246]

    const sat = Math.max(20, Math.min(130, Number(colorSaturation))) / 100
    const rgb = basePrimary.map((c) => Math.round(c * sat))

    root.style.setProperty('--color-primary', `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`)
    // Button colors are now separate from theme accent - don't override them
  }, [colorScheme, colorSaturation])
}

export function useApplyCustomTheme(customTheme) {
  useEffect(() => {
    const root = document.documentElement

    if (customTheme?.bg)
      root.style.setProperty('--color-bg', customTheme.bg)

    if (customTheme?.text)
      root.style.setProperty('--color-text', customTheme.text)

    if (customTheme?.primary)
      root.style.setProperty('--color-primary', customTheme.primary)

    // Button colors are now separate from theme accent - don't override them
    // if (customTheme?.button)
    //   root.style.setProperty('--color-btn-bg', customTheme.button)

    if (customTheme?.panel)
      root.style.setProperty('--panel-bg', customTheme.panel)

    if (customTheme?.border)
      root.style.setProperty('--color-border', customTheme.border)

  }, [customTheme])
}

export function useApplyTypography(uiScale, fontSize) {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--ui-zoom', `${uiScale}%`)

    const base = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px'
    root.style.setProperty('--font-size', base)

    const scale = fontSize === 'small' ? '0.9' : fontSize === 'large' ? '1.15' : '1'
    root.style.setProperty('--font-scale', scale)
  }, [uiScale, fontSize])
}

export function useApplyBackground(backgroundMode, backgroundColor, backdropBlur, transparency) {
  useEffect(() => {
    const body = document.body
    if (backgroundMode === 'solid') {
      const color = (backgroundColor || '').toLowerCase()
      const migrated = color === '#f5f7fb' ? '#eef1f6' : (color || '#eef1f6')
      body.style.background = migrated
    }
    const root = document.documentElement
    root.style.setProperty('--backdrop-blur', String(backdropBlur))

    const alpha = Math.max(0.35, Math.min(0.85, Number(transparency) / 100))
    root.style.setProperty('--panel-bg', `rgba(238,241,246,${alpha})`)
  }, [backgroundMode, backgroundColor, backdropBlur, transparency])
}
