import { Link } from "react-router-dom";
import Login from "./Login";

function LoginModal({ onClose }: { onClose: () => void }) {
  return (  
    <div className="modal">
      <div>
        <button onClick={onClose}>X</button>
        <Login />

      </div>
      
    </div>
  );
}

export default LoginModal; 