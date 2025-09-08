import React from 'react'
import MediaUpload from './MediaUpload'

const CreateHistoryForm = ({ 
  formData, 
  loading, 
  error, 
  handleChange, 
  handleSubmit,
  attachedFiles,
  handleFilesChange,
  setMediaError 
}) => {

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label required">Заголовок:</label>
        <input
          type="text"
          name="title"
          className="form-input"
          value={formData.title}
          onChange={handleChange}
          placeholder="Введите заголовок истории"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Описание:</label>
        <textarea
          name="description"
          className="form-input form-textarea no-resize xl"
          value={formData.description}
          onChange={handleChange}
          placeholder="Введите описание истории"
          rows="8"
          disabled={loading}
        />
      </div>

      <MediaUpload
        attachedFiles={attachedFiles}
        onFilesChange={handleFilesChange}
        loading={loading}
        error={error}
        setError={setMediaError}
      />

      {/* hint removed per request */}
    </form>
  )
}

export default CreateHistoryForm 
