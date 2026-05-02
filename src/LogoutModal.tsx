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
        
        <h2 className="modal-title">Confirm Logout</h2>
        
        <p className="modal-message">
          Are you sure you want to logout? All provided information and unsaved data will be lost.
        </p>
        
        <div className="modal-actions">
          <button 
            className="btn btn-outline btn-cancel" 
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger btn-confirm" 
            onClick={onConfirm}
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
