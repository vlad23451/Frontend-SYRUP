import { useState, useCallback } from 'react'

export const useError = () => {
  const [error, setError] = useState(null)

  const setErrorMessage = useCallback((message) => {
    setError(message)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((error) => {
    const message = error?.message || error || 'Произошла ошибка'
    setErrorMessage(message)
  }, [setErrorMessage])

  const withErrorHandling = useCallback(async (asyncFunction) => {
    try {
      clearError()
      const result = await asyncFunction()
      return result
    } catch (err) {
      handleError(err)
      throw err
    }
  }, [clearError, handleError])

  return {
    error,
    setError,
    setErrorMessage,
    clearError,
    handleError,
    withErrorHandling
  }
}
