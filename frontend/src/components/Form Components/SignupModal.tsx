import { Link } from "react-router-dom";
import Signup from "./Signup";
import "./Forms.css";

function SignupModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal">
      <div>
        <Signup onExit={onClose} />
      </div>
    </div>
  );
}

export default SignupModal;

