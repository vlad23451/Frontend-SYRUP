const HistoryContent = ({ history }) => {
  return (
    <>
      <div className="history-card-divider" />
      <div className="history-image-placeholder tall">
        <img src="https://placehold.co/600x220?text=Image" alt="Заглушка" className="history-image tall" />
      </div>
      {history.description && (
        <div className="history-description-row">
          <span className="history-label">Описание:</span>
          <span className="history-description-text">{history.description}</span>
        </div>
      )}
    </>
  )
}

export default HistoryContent 
