import React from 'react'
import ConfirmModal from '../common/ConfirmModal'

const CustomConfirmModal = ({ open, onConfirm, onCancel, message }) => {
  return (
    <ConfirmModal open={open} onConfirm={onConfirm} onCancel={onCancel} message={message} confirmText="OK" cancelText="Отмена" />
  )
}

export default CustomConfirmModal
