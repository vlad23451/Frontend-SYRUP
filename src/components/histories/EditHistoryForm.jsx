/**
 * @fileoverview Форма редактирования истории
 * 
 * Не содержит бизнес-логики — все обработчики (`handleChange`, `handleSubmit`, `onCancel`)
 * приходят извне. Кнопки действий интегрированы в разметку модалки
 * и занимают всю ширину ряда с выравниванием space-between.
 */
import React from 'react'

const EditHistoryForm = ({ formData, handleChange, handleSubmit, onCancel }) => {
  return (
    <div className="create-history-form">

      <form onSubmit={handleSubmit} className="form-body">
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
          />
        </div>

        <div className="custom-modal-actions no-divider space-between">
          <button type="submit" className="custom-modal-btn">Сохранить</button>
        </div>
      </form>
    </div>
  )
}

export default EditHistoryForm 
