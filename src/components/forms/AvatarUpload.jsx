import React from 'react'

const AvatarUpload = ({ avatarPreview, onFileChange, loading }) => (
  <div className="avatar-upload">
    <label htmlFor="avatar-upload-input" className="avatar-upload-label">Аватарка</label>
    <div className="avatar-upload-preview">
      <label htmlFor="avatar-upload-input" className="avatar-upload-circle">
        {avatarPreview ? (
          <img src={avatarPreview} alt="avatar preview" className="avatar-upload-img" />
        ) : (
          <span className="avatar-upload-plus">+</span>
        )}
        <input
          id="avatar-upload-input"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          disabled={loading}
          style={{display: 'none'}}
        />
      </label>
    </div>
    <span className="avatar-upload-hint">Выберите файл</span>
  </div>
)

export default AvatarUpload 
