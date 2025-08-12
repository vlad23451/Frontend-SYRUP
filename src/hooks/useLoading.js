import { useState, useCallback } from 'react'

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState)

  const startLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const withLoading = useCallback(async (asyncFunction) => {
    startLoading()
    try {
      const result = await asyncFunction()
      return result
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  return {
    isLoading,
    setIsLoading,
    startLoading,
    stopLoading,
    withLoading
  }
}
