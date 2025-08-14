import { Link } from "react-router-dom";

function SignupModal({ onClose }: { onClose: () => void }) {
  return (  
    <div className="modal">
      <button onClick={onClose}>X</button>
      <Link to="/signup">Go to Signup</Link>
    </div>
  );
}

export default SignupModal; 