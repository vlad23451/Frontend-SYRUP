import React, { useState, useEffect } from 'react'
import MediaPreview from '../histories/MediaPreview'
import { PrivateMediaService } from '../../services/privateMediaService'

const MediaPreviewAdapter = ({ attachedFileIds = [] }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadFilesInfo = async () => {
      if (!attachedFileIds || attachedFileIds.length === 0) {
        setFiles([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Загружаем информацию о всех файлах параллельно
        const filePromises = attachedFileIds.map(async (fileId) => {
          try {
            const fileInfo = await PrivateMediaService.getFileInfo(fileId)
            return fileInfo
          } catch (err) {
            console.error(`Ошибка загрузки файла ${fileId}:`, err)
            // Возвращаем объект с ошибкой для отображения
            return {
              id: fileId,
              filename: 'Ошибка загрузки',
              file_type: 'error',
              download_url: null,
              error: true
            }
          }
        })

        const filesInfo = await Promise.all(filePromises)
        setFiles(filesInfo.filter(file => file)) // Убираем null/undefined
      } catch (err) {
        console.error('Ошибка загрузки информации о файлах:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadFilesInfo()
  }, [attachedFileIds])

  if (loading) {
    return (
      <div className="media-preview-loading">
        <span>Загрузка медиа файлов...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="media-preview-error">
        <span>Ошибка загрузки: {error}</span>
      </div>
    )
  }

  if (!files || files.length === 0) {
    return null
  }

  return <MediaPreview attachedFiles={files} />
}

export default MediaPreviewAdapter
