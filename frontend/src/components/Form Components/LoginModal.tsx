import Login from "./Login";
import "./Forms.css";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  return (
    <div className="modal">
      <div>
        <Login onExit={onClose} onLoginSuccess={() => onLoginSuccess?.()} />
      </div>
    </div>
  );
}

export default LoginModal;
