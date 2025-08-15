import axios from "axios";
import { useState, type ChangeEvent } from "react";
//const url = import.meta.env.VITE_API_BASE_URL;
const url = "http://localhost:3000";
type SignupForm = {
  username: string;
  password: string;
};

export default function Signup() {
  const [form, setForm] = useState<SignupForm>({
    username: "",
    password: "",
  });
  const [success, setSuccess] = useState();
  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit() {
    axios.post(url + "/signup", form).then((res) => {
      setSuccess(res.data);
    });
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
      <p>{success}</p>
    </div>
  );
}
