import { Link } from "react-router-dom";
import Signup from "./Signup";

function SignupModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal">
      <div>
        <button onClick={onClose}>X</button>
        <Signup onExit={onClose} />
      </div>
    </div>
  );
}

export default SignupModal;

