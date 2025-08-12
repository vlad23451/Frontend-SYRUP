import React, { useEffect, useRef } from 'react'
import MessengerLayout from './MessengerLayout'
import ModalHeader from '../ui/ModalHeader'
import { useDraggableModal } from '../../hooks/ui/useDraggableModal'

const MessengerModal = ({ open, selectedChat, onClose }) => {
  const containerRef = useRef(null)
  const handleRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  useDraggableModal(open, containerRef, handleRef)

  if (!open) return null
  
  const handleBackdrop = (e) => {
    if (e.target.classList.contains('custom-modal-backdrop')) onClose()
  }

  return (
    <div className="custom-modal-backdrop" onClick={handleBackdrop}>
      <div className="custom-modal-wrapper" ref={containerRef}>
        <div className="custom-modal messenger-modal" style={{maxWidth: 920, width: '95vw', height: '92vh', maxHeight: '92vh', overflow: 'hidden', display:'flex', flexDirection:'column'}}>
          {false && <ModalHeader title="" onClose={onClose} hideClose />}
          <div style={{flex:1, minHeight: 0}}>
            <MessengerLayout selectedChat={selectedChat} />
          </div>
        </div>
        <div className="modal-drag-handle bottom external" ref={handleRef} title="Переместить" />
        <div className="modal-drag-visible bottom external" />
      </div>
    </div>
  )
}

export default MessengerModal


