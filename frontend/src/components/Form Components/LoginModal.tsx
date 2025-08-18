import Login from "./Login";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  return (
    <div className="modal">
      <div>
        <button onClick={onClose}>X</button>
        <Login onExit={onClose} onLoginSuccess={() => onLoginSuccess?.()} />
      </div>
    </div>
  );
}

export default LoginModal;

