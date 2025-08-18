import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, type ChangeEvent } from "react";
const url = import.meta.env.VITE_API_BASE_URL;
type SignupForm = {
  username: string;
  password: string;
};


export default function Signup() {
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
    axios.post(url + "/signup", form).then((res) => {
      setSuccess(res.data);
    });
  }

  const id = 123 // change to something moredynamic

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
      <button onClick={() => routeChange(123)} > Login as Guest </button>
      <p>{success}</p>
    </div>
  );
}
