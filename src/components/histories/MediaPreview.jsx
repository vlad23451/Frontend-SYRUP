import React, { useState, useEffect, useMemo } from 'react'

import { getMediaType, getFileIcon } from '../../services/mediaService'
import MediaPlayerModal from '../common/MediaPlayerModal'
import PlayPauseButton from '../ui/PlayPauseButton'

const MediaPreview = ({ attachedFiles = [] }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [mediaPlayerOpen, setMediaPlayerOpen] = useState(false)
  const [mediaPlayerIndex, setMediaPlayerIndex] = useState(0)
  const [playingStates, setPlayingStates] = useState({})
  const [previousVolume, setPreviousVolume] = useState({})
  const [isMuted, setIsMuted] = useState({})

  const attachedFileIds = useMemo(() => {
    return attachedFiles.map(file => file.id).join(',')
  }, [attachedFiles])

  useEffect(() => {
    if (!attachedFiles || attachedFiles.length === 0) {
      setFiles([])
      return
    }
    
    const processedFiles = attachedFiles.map(file => ({
      ...file,
      name: file.filename || file.name,
      file_type: file.mime_type || file.file_type,
      download_url: file.download_url
    }))
    
    setFiles(processedFiles)
  }, [attachedFileIds, attachedFiles])

  const handleImageError = (file, index) => {
    console.error('Failed to load image:', file.download_url)
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const openMediaPlayer = (fileIndex) => {
    setMediaPlayerIndex(fileIndex)
    setMediaPlayerOpen(true)
  }

  const closeMediaPlayer = () => {
    setMediaPlayerOpen(false)
  }

  const getViewableFiles = () => {
    return files.filter(file => {
      const mediaType = file.mediaType || getMediaType(file.mime_type || file.file_type || '')
      return ['image', 'video', 'audio'].includes(mediaType)
    })
  }

  const toggleMute = (fileId) => {
    const audio = document.querySelector(`audio[data-file-id="${fileId}"]`);
    if (!audio) return;

    const currentMuted = isMuted[fileId] || false;
    
    if (currentMuted) {
      const savedVolume = previousVolume[fileId] || 0.7;
      audio.volume = savedVolume;
      audio.muted = false;
      
      const fill = audio.closest('.media-audio').querySelector('.volume-fill');
      const thumb = audio.closest('.media-audio').querySelector('.volume-thumb');
      if (fill && thumb) {
        fill.style.width = `${savedVolume * 100}%`;
        thumb.style.left = `${savedVolume * 100}%`;
      }
      
      updateVolumeIcon(audio, savedVolume);
      
      setIsMuted(prev => ({ ...prev, [fileId]: false }));
    } else {
      const currentVolume = audio.volume;
      setPreviousVolume(prev => ({ ...prev, [fileId]: currentVolume }));
      
      audio.volume = 0;
      audio.muted = true;
      
      const fill = audio.closest('.media-audio').querySelector('.volume-fill');
      const thumb = audio.closest('.media-audio').querySelector('.volume-thumb');
      if (fill && thumb) {
        fill.style.width = '0%';
        thumb.style.left = '0%';
      }
      
      updateVolumeIcon(audio, 0);
      
      setIsMuted(prev => ({ ...prev, [fileId]: true }));
    }
  };

  const updateVolumeIcon = (audio, volume) => {
    const volumeIcon = audio.closest('.media-audio').querySelector('.volume-icon svg');
    if (!volumeIcon) return;
    
    const fileId = audio.getAttribute('data-file-id');
    const muted = isMuted[fileId] || false;
    
    volumeIcon.innerHTML = '';
    
    if (muted || volume === 0) {
      volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      `;
    } else if (volume < 0.3) {
      volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    } else if (volume < 0.7) {
      volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    } else {
      volumeIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    }
  };

  const getMediaTypeByName = (fileName) => {
    if (!fileName) return 'other'
    
    const extension = fileName.toLowerCase().split('.').pop()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico'].includes(extension)) {
      return 'image'
    }
    
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp'].includes(extension)) {
      return 'video'
    }
    
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'].includes(extension)) {
      return 'audio'
    }
    
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
      return 'document'
    }
    
    return 'other'
  }

  const renderMediaFile = (file, index) => {
    let mediaType = file.mediaType || getMediaType(file.mime_type || file.file_type || '')

    if (mediaType === 'other' && (file.name || file.filename)) {
      mediaType = getMediaTypeByName(file.name || file.filename)
    }
    
    if (mediaType === 'other' && file.download_url) {
      mediaType = getMediaTypeByName(file.download_url)
    }
    
    switch (mediaType) {
      case 'image':
        return (
          <div key={file.id} className="media-preview-item media-image">
            <img 
              src={file.download_url} 
              alt="Фотография" 
              className="media-preview-img"
              onError={() => handleImageError(file, index)}
              onClick={() => openMediaPlayer(index)}
              loading="lazy"
              style={{ cursor: 'pointer' }}
              title="Нажмите для просмотра в полном размере"
            />
            {file.description && (
              <div className="media-preview-caption">{file.description}</div>
            )}
          </div>
        )

      case 'video':
        return (
          <div key={file.id} className="media-preview-item media-video">
            <div className="media-preview-video-container" onClick={() => openMediaPlayer(index)}>
              <video 
                controls 
                className="media-preview-video"
                onError={() => handleImageError(file, index)}
                preload="metadata"
                onClick={(e) => e.stopPropagation()}
              >
                <source src={file.download_url} type={file.file_type} />
                Ваш браузер не поддерживает воспроизведение видео.
              </video>
              <div className="media-preview-overlay">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" title="Открыть в полноэкранном режиме">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
            </div>
            {file.description && (
              <div className="media-preview-caption">{file.description}</div>
            )}
          </div>
        )

      case 'audio':
        return (
          <div key={file.id} className="media-preview-item media-audio">
            <div className="audio-player-container">
              <PlayPauseButton
                isPlaying={playingStates[file.id] || false}
                onClick={() => {
                  const audio = document.querySelector(`audio[data-file-id="${file.id}"]`);
                  if (audio) {
                    if (audio.paused) {
                      audio.play();
                      setPlayingStates(prev => ({ ...prev, [file.id]: true }));
                    } else {
                      audio.pause();
                      setPlayingStates(prev => ({ ...prev, [file.id]: false }));
                    }
                  }
                }}
                title="Воспроизвести/Пауза"
              />
              
              <div className="audio-cover">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
              </div>
              
              <div className="audio-info">
                <div className="audio-title">{file.name || file.filename || 'Аудио файл'}</div>
              </div>
              
              <div className="volume-icon" onClick={() => toggleMute(file.id)} style={{ cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              </div>
              
              <div className="audio-volume-slider">
                <div className="volume-container">
                  <div 
                    className="volume-track"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const mouseX = e.clientX - rect.left;
                      const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
                      const percentDisplay = e.target.closest('.volume-container').querySelector('.volume-percent');
                      if (percentDisplay) {
                        percentDisplay.textContent = `${Math.round(percentage * 100)}%`;
                        percentDisplay.style.top = `${rect.top - 45}px`;
                        percentDisplay.style.left = `${rect.left + mouseX}px`;
                        percentDisplay.style.transform = 'translateX(-50%)';
                        percentDisplay.style.opacity = '1';
                        percentDisplay.style.display = 'block';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const percentDisplay = e.target.closest('.volume-container').querySelector('.volume-percent');
                      if (percentDisplay) {
                        percentDisplay.style.opacity = '0';
                        percentDisplay.style.display = 'none';
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const updateVolume = (clientX) => {
                        const clickX = clientX - rect.left;
                        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                        const audio = e.target.closest('.media-audio').querySelector('audio');
                        if (audio) {
                          audio.volume = percentage;
                          const fill = e.target.closest('.volume-track').querySelector('.volume-fill');
                          const thumb = e.target.closest('.volume-track').querySelector('.volume-thumb');
                          if (fill && thumb) {
                            fill.style.width = `${percentage * 100}%`;
                            thumb.style.left = `${percentage * 100}%`;
                          }
                          updateVolumeIcon(audio, percentage);
                        }
                      };
                      
                      updateVolume(e.clientX);
                      
                      const handleMouseMove = (e) => updateVolume(e.clientX);
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                      const audio = e.target.closest('.media-audio').querySelector('audio');
                      if (audio) {
                        audio.volume = percentage;
                        const fill = e.target.closest('.volume-track').querySelector('.volume-fill');
                        const thumb = e.target.closest('.volume-track').querySelector('.volume-thumb');
                        if (fill && thumb) {
                          fill.style.width = `${percentage * 100}%`;
                          thumb.style.left = `${percentage * 100}%`;
                        }
                        updateVolumeIcon(audio, percentage);
                      }
                    }}
                  >
                    <div className="volume-fill"></div>
                    <div className="volume-thumb"></div>
                  </div>
                  <div className="volume-percent" style={{display: 'none'}}>0%</div>
                </div>
              </div>
            </div>
            
            <div className="audio-player-controls">
              <audio 
                data-file-id={file.id}
                className="media-preview-audio"
                controlsList="nodownload"
                onError={() => handleImageError(file, index)}
                onLoadedMetadata={(e) => {
                  e.target.volume = 0.7;
                  const fill = e.target.closest('.media-audio').querySelector('.volume-fill');
                  const thumb = e.target.closest('.media-audio').querySelector('.volume-thumb');
                  if (fill && thumb) {
                    fill.style.width = '70%';
                    thumb.style.left = '70%';
                  }
                  
                  const progressFill = e.target.closest('.media-audio').querySelector('.audio-progress-fill');
                  if (progressFill) {
                    progressFill.style.width = '0%';
                  }
                  
                  updateVolumeIcon(e.target, 0.7);
                }}
                onPlay={(e) => {
                  const fileId = e.target.getAttribute('data-file-id');
                  setPlayingStates(prev => ({ ...prev, [fileId]: true }));
                }}
                onPause={(e) => {
                  const fileId = e.target.getAttribute('data-file-id');
                  setPlayingStates(prev => ({ ...prev, [fileId]: false }));
                }}
                onEnded={(e) => {
                  const fileId = e.target.getAttribute('data-file-id');
                  setPlayingStates(prev => ({ ...prev, [fileId]: false }));
                }}
                onTimeUpdate={(e) => {
                  const audio = e.target;
                  const currentTime = audio.currentTime;
                  const duration = audio.duration;
                  const minutes = Math.floor(currentTime / 60);
                  const seconds = Math.floor(currentTime % 60);
                  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                  
                  const timeDisplay = e.target.closest('.media-audio').querySelector('.audio-current-time');
                  if (timeDisplay) {
                    timeDisplay.textContent = timeString;
                  }
                  
                  if (duration > 0) {
                    const progress = (currentTime / duration) * 100;
                    const progressFill = e.target.closest('.media-audio').querySelector('.audio-progress-fill');
                    if (progressFill) {
                      progressFill.style.width = `${Math.max(0, Math.min(100, progress))}%`;
                    }
                  }
                }}
              preload="metadata"
              >
                <source src={file.download_url} type={file.file_type} />
                Ваш браузер не поддерживает воспроизведение аудио.
              </audio>
              <div className="audio-progress-container">
                <div className="progress-container">
                  <div 
                    className="audio-progress-track"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const mouseX = e.clientX - rect.left;
                      const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
                      const audio = e.target.closest('.media-audio').querySelector('audio');
                      if (audio && audio.duration) {
                        const timeAtPosition = percentage * audio.duration;
                        const minutes = Math.floor(timeAtPosition / 60);
                        const seconds = Math.floor(timeAtPosition % 60);
                        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                        
                        const timeDisplay = e.target.closest('.progress-container').querySelector('.progress-time');
                        if (timeDisplay) {
                          timeDisplay.textContent = timeString;
                          timeDisplay.style.top = `${rect.top - 45}px`;
                          timeDisplay.style.left = `${rect.left + mouseX}px`;
                          timeDisplay.style.transform = 'translateX(-50%)';
                          timeDisplay.style.opacity = '1';
                          timeDisplay.style.display = 'block';
                        }
                      }
                    }}
                    onMouseLeave={(e) => {
                      const timeDisplay = e.target.closest('.progress-container').querySelector('.progress-time');
                      if (timeDisplay) {
                        timeDisplay.style.opacity = '0';
                        timeDisplay.style.display = 'none';
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const updateProgress = (clientX) => {
                        const clickX = clientX - rect.left;
                        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                        const audio = e.target.closest('.media-audio').querySelector('audio');
                        if (audio && audio.duration) {
                          audio.currentTime = percentage * audio.duration;
                        }
                      };
                      
                      updateProgress(e.clientX);
                      
                      const handleMouseMove = (e) => updateProgress(e.clientX);
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
                      const audio = e.target.closest('.media-audio').querySelector('audio');
                      if (audio && audio.duration) {
                        audio.currentTime = percentage * audio.duration;
                      }
                    }}
                  >
                    <div className="audio-progress-fill"></div>
                  </div>
                  <div className="progress-time" style={{display: 'none'}}>0:00</div>
                </div>
                
                <div className="audio-time-display">
                  <span className="audio-current-time">0:00</span>
                </div>
              </div>
            </div>
            
            {file.description && (
              <div className="media-preview-caption">{file.description}</div>
            )}
          </div>
        )

      case 'document':
      default:
        return (
          <div key={file.id} className="media-preview-item media-document">
            <a 
              href={file.download_url} 
              className="media-document-link"
              download={file.name || file.filename}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="media-document-icon">
                {getFileIcon(mediaType)}
              </div>
              <div className="media-document-info">
                <span className="media-document-name">{file.name || file.filename || 'Файл'}</span>
                {(file.size || file.file_size) && (
                  <span className="media-document-size">{formatFileSize(file.size || file.file_size)}</span>
                )}
              </div>
              <div className="media-document-download">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
            </a>
            {file.description && (
              <div className="media-preview-caption">{file.description}</div>
            )}
          </div>
        )
    }
  }

  if (!files.length && !loading) {
    return null
  }

  if (loading) {
    return (
      <div className="media-preview-loading">
        <span>Загрузка файлов...</span>
      </div>
    )
  }

  return (
    <div className="media-preview">
      <div className={`media-preview-grid ${files.length === 1 ? 'single' : files.length === 2 ? 'double' : 'multiple'}`}>
        {files.map((file, index) => renderMediaFile(file, index))}
      </div>
      
      <MediaPlayerModal
        isOpen={mediaPlayerOpen}
        onClose={closeMediaPlayer}
        files={getViewableFiles()}
        initialIndex={mediaPlayerIndex}
      />
    </div>
  )
}

export default MediaPreview
