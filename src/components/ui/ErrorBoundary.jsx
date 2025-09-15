/**
 * @fileoverview React Error Boundary для ловли ошибок рендеринга
 * 
 * Перехватывает ошибки React компонентов и показывает fallback UI
 * вместо полного краша приложения.
 */

import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Обновляем состояние, чтобы показать fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    const errorDetails = {
      error: error,
      errorInfo: errorInfo,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      props: this.props,
      state: this.state
    }

    console.error('🚨 React Error Boundary caught an error:', errorDetails)

    // Дополнительная диагностика для мобильных устройств
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      console.error('📱 Mobile-specific error details:', {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height
        },
        orientation: window.screen.orientation?.type || 'unknown',
        connection: navigator.connection?.effectiveType || 'unknown',
        memory: navigator.deviceMemory || 'unknown'
      })
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-container">
          <div className="error" style={{ margin: '40px 20px', textAlign: 'center' }}>
            <h3>😵 Что-то пошло не так</h3>
            <p>Произошла ошибка при загрузке страницы.</p>
            
            {/* Показываем детали только в разработке */}
            {process.env.NODE_ENV === 'development' && (this.state.error || this.state.errorInfo) && (
              <details style={{ marginTop: '20px', textAlign: 'left' }}>
                <summary>Техническая информация</summary>
                <pre style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '10px', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  overflow: 'auto',
                  marginTop: '10px'
                }}>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <br />
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
            
            <button 
              onClick={() => window.location.reload()} 
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
