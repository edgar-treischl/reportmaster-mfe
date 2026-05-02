import './LogoutModal.css'

interface LogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function LogoutModal({ isOpen, onConfirm, onCancel }: LogoutModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon warning">⚠️</div>
        
        <h2 className="modal-title">Abmeldung bestätigen</h2>
        
        <p className="modal-message">
          Möchten Sie sich wirklich abmelden? Alle eingegebenen Informationen gehen dabei verloren.
        </p>
        
        <div className="modal-actions">
          <button 
            className="btn btn-outline btn-cancel" 
            onClick={onCancel}
          >
            Abbruch
          </button>
          <button 
            className="btn btn-danger btn-confirm" 
            onClick={onConfirm}
          >
            Ja, abmelden
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
