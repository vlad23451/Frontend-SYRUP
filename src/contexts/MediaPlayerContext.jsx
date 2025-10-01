import React, { createContext, useContext, useState } from 'react'

const MediaPlayerContext = createContext()

export const useMediaPlayer = () => {
  const context = useContext(MediaPlayerContext)
  if (!context) {
    throw new Error('useMediaPlayer must be used within a MediaPlayerProvider')
  }
  return context
}

export const MediaPlayerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState([])
  const [initialIndex, setInitialIndex] = useState(0)

  const openMediaPlayer = (mediaFiles, index = 0) => {
    setFiles(mediaFiles)
    setInitialIndex(index)
    setIsOpen(true)
  }

  const closeMediaPlayer = () => {
    setIsOpen(false)
    setFiles([])
    setInitialIndex(0)
  }

  return (
    <MediaPlayerContext.Provider value={{
      isOpen,
      files,
      initialIndex,
      openMediaPlayer,
      closeMediaPlayer
    }}>
      {children}
    </MediaPlayerContext.Provider>
  )
}
