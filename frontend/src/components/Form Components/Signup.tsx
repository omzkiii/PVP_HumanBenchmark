import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import { useContext, useState, type ChangeEvent } from "react";
import { IsAuthorized } from "../../API/AuthHelper";
const url = import.meta.env.VITE_API_BASE_URL;
type SignupForm = {
  username: string;
  password: string;
};

interface SignupProps {
  onExit: () => void;
}
export default function Signup({ onExit }: SignupProps) {
  const auth = useContext(IsAuthorized); //GLOBAL AUTH STATE
  if (!auth) throw new Error("IsAuthorized must be used within AuthHelper");
  const [isAuthorized, setIsAuthorized] = auth;

  let navigate = useNavigate();
  const [form, setForm] = useState<SignupForm>({
    username: "",
    password: "",
  });
  const [success, setSuccess] = useState();

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const routeChange = (id: number) => {
    navigate(`/matches/${id}`);
  };

  function handleSubmit() {
    const signup = async () => {
      const status = await axios.post(url + "/signup", form).then((res) => {
        setSuccess(res.data);
        return res;
      });
      if (status.status === HttpStatusCode.Ok) {
        setIsAuthorized(true);
        onExit();
      } else {
        setIsAuthorized(false);
      }
    };
    try {
      signup();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
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

      <button onClick={handleSubmit}>Sign Up</button>
      <button onClick={() => routeChange(123)}> Login as Guest </button>
      <p>{success}</p>
    </div>
  );
}
