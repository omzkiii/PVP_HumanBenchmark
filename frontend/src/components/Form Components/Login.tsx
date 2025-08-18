import axios from "axios";
import { useState, type ChangeEvent } from "react";
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
  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [success, setSuccess] = useState();

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

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
      }
      console.log("User Validated: ", userRes.data);
    } catch (e: unknown) {
      console.log("Failed", e);
    }

    onExit(); //
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
      <button onClick={handleSubmit}>Log in</button>
      <p>Succesful login user: {success}</p>
    </div>
  );
}
