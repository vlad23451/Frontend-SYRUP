import { apiRequest } from '../utils/apiUtils'

export class PrivateMediaService {
  static async uploadFile(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiRequest('/private-media/upload', {
        method: 'POST',
        body: formData
      })

      if (response && response.id) {
        return response.id
      } else {
        console.error('Неожиданный формат ответа сервера:', response)
        throw new Error('Не удалось получить ID файла')
      }
    } catch (error) {
      console.error('Ошибка загрузки файла:', error)
      throw error
    }
  }

  static async attachFileToMessage(fileId, messageId) {
    try {
      await apiRequest('/private-media/attach', {
        method: 'POST',
        body: JSON.stringify({
          file_id: fileId,
          message_id: messageId
        })
      })
    } catch (error) {
      console.error('Ошибка прикрепления файла к сообщению:', error)
      throw error
    }
  }

  static async detachFileFromMessage(fileId, messageId) {
    try {
      await apiRequest('/private-media/detach', {
        method: 'POST',
        body: JSON.stringify({
          file_id: fileId,
          message_id: messageId
        })
      })
    } catch (error) {
      console.error('Ошибка открепления файла от сообщения:', error)
      throw error
    }
  }

  static async uploadAndAttachFile(file, messageId) {
    try {
      // Сначала загружаем файл
      const fileId = await this.uploadFile(file)
      
      // Затем прикрепляем к сообщению
      await this.attachFileToMessage(fileId, messageId)
      
      return fileId
    } catch (error) {
      console.error('Ошибка загрузки и прикрепления файла:', error)
      throw error
    }
  }

  static async getFileInfo(fileId) {
    try {
      const response = await apiRequest(`/private-media/files/${fileId}`, {
        method: 'GET'
      })

      return response
    } catch (error) {
      console.error('Ошибка получения информации о файле:', error)
      throw error
    }
  }

  static getFileTypeInfo(fileName) {
    const extension = fileName.split('.').pop().toLowerCase()
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv']
    const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a']
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
    const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz']
    
    if (imageExtensions.includes(extension)) {
      return { type: 'image', icon: '🖼️', extension }
    } else if (videoExtensions.includes(extension)) {
      return { type: 'video', icon: '🎥', extension }
    } else if (audioExtensions.includes(extension)) {
      return { type: 'audio', icon: '🎵', extension }
    } else if (documentExtensions.includes(extension)) {
      return { type: 'document', icon: '📄', extension }
    } else if (archiveExtensions.includes(extension)) {
      return { type: 'archive', icon: '📦', extension }
    } else {
      return { type: 'unknown', icon: '📎', extension }
    }
  }
}

export default PrivateMediaService
