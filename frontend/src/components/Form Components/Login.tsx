import axios from "axios";
import { useContext, useState, type ChangeEvent } from "react";
import { IsAuthorized } from "../../API/AuthHelper";
import "./Forms.css";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_API_BASE_URL;
type LoginForm = {
  username: string;
  password: string;
};

interface LoginProps {
  onExit: () => void;
  onLoginSuccess?: () => void;
}

export default function Login({ onExit, onLoginSuccess }: LoginProps) {
  const auth = useContext(IsAuthorized); //GLOBAL AUTH STATE
  if (!auth) throw new Error("IsAuthorized must be used within AuthHelper");
  const [isAuthorized, setIsAuthorized] = auth;

  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [success, setSuccess] = useState();

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  let navigate = useNavigate();
  const routeChange = (id: number) => {
    navigate(`/matches/${id}`);
  };

  async function handleSubmit() {
    try {
      const res = await axios.post(url + "/login", form, {
        withCredentials: true, //it tells axios  to include cookies from your browser when making cross-origin requests.
      }); // call login

      setSuccess(res.data);

      //Test user validation
      //Confirm /me
      const userRes = await axios.get(url + "/me", {
        withCredentials: true,
      });
      if (userRes.status === 200) {
        onLoginSuccess?.();
        setIsAuthorized(true);
      }
      console.log("User Validated: ", userRes.data);
    } catch (e: unknown) {
      console.log("Failed", e);
    }

    onExit(); //
  }
  return (
    <div className="Form-modal">
      <button onClick={onExit} className="exitBtn">
        X
      </button>
      <h1> LOG IN </h1>
      <div className="wrap">
        <div>
          username
          <input
            name="username"
            onChange={handleOnChange}
            value={form.username}
          />
        </div>
        <div>
          password
          <input
            name="password"
            onChange={handleOnChange}
            value={form.password}
          />
        </div>
        <button onClick={handleSubmit}>Log in</button>
        <button onClick={() => routeChange(123)}> Login as Guest </button>
      </div>
    </div>
  );
}
