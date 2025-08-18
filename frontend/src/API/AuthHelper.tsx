import axios, { HttpStatusCode, type AxiosResponse } from "axios";
import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
const API = import.meta.env.VITE_API_BASE_URL;

type AuthContextType = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

export const IsAuthorized = createContext<AuthContextType | undefined>(
  undefined,
);
function AuthHelper({ children }: { children: ReactNode }) {
  const [authStatus, setAuthStatus] = useState(false);
  useEffect(() => {
    const connect = async () => {
      const auth = await axios
        .get(API + "/auth", { withCredentials: true })
        .then((res: AxiosResponse) => {
          return res.status;
        });
      if (auth === HttpStatusCode.Ok) {
        setAuthStatus(true);
      } else {
        setAuthStatus(false);
      }
    };
    connect();
  }, []);
  return (
    <IsAuthorized value={[authStatus, setAuthStatus]}>{children}</IsAuthorized>
  );
}

export default AuthHelper;
