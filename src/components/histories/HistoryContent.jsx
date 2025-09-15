import MediaPreview from './MediaPreview'

const HistoryContent = ({ history }) => {
  return (
    <>
      <div className="history-card-divider" />
      
      <MediaPreview attachedFiles={history.attached_files} />
      
      {history.description && (
        <div className="history-description-row">
          <span className="history-description-text">{history.description}</span>
        </div>
      )}
    </>
  )
}

export default HistoryContent 
