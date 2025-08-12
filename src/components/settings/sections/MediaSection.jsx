import React from 'react'

const MediaSection = ({
  imageQuality,
  setImageQuality,
  autoCompressImages,
  setAutoCompressImages,
  autoPlayVideo,
  setAutoPlayVideo,
  autoDownload,
  setAutoDownload,
  downloadFolder,
  setDownloadFolder,
  getPressedStyle,
}) => {
  return (
    <div style={{ display:'grid', gap:10 }}>
      <div style={{ fontWeight:700 }}>Медиа</div>
      <div style={{ display:'grid', gap:6 }}>
        <span>Качество изображений</span>
        {[
          {k:'high',label:'Высокое'},
          {k:'compressed',label:'Сжатое'},
        ].map(({k,label}) => (
          <button
            key={k}
            className="custom-modal-btn"
            onClick={()=> setImageQuality(k)}
            aria-pressed={imageQuality===k}
            style={{ width:'100%', justifyContent:'center', ...getPressedStyle(imageQuality===k) }}
          >
            {label}
          </button>
        ))}
      </div>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={autoCompressImages} onChange={(e)=> setAutoCompressImages(e.target.checked)} />
        <span>Автосжатие изображений</span>
      </label>
      <label style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
        <input type="checkbox" checked={autoPlayVideo} onChange={(e)=> setAutoPlayVideo(e.target.checked)} />
        <span>Автовоспроизведение видео</span>
      </label>
      <div style={{ display:'grid', gap:6 }}>
        <span>Автозагрузка</span>
        {[
          {k:'wifi',label:'Только Wi‑Fi'},
          {k:'always',label:'Всегда'},
        ].map(({k,label}) => (
          <button
            key={k}
            className="custom-modal-btn"
            onClick={()=> setAutoDownload(k)}
            aria-pressed={autoDownload===k}
            style={{ width:'100%', justifyContent:'center', ...getPressedStyle(autoDownload===k) }}
          >
            {label}
          </button>
        ))}
      </div>
      <label style={{ display:'grid', gap:4 }}>
        <span>Папка для сохранения</span>
        <input type="text" value={downloadFolder} onChange={(e)=> setDownloadFolder(e.target.value)} placeholder="Например, /Downloads" />
      </label>
    </div>
  )
}

export default MediaSection


