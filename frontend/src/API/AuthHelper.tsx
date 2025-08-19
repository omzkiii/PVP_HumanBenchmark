import axios, { HttpStatusCode, type AxiosResponse } from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
const API = import.meta.env.VITE_API_BASE_URL;

export type AuthContextType = [
  boolean | null,
  React.Dispatch<React.SetStateAction<boolean | null>>,
];

export const IsAuthorized = createContext<AuthContextType | undefined>(
  undefined,
);

function AuthHelper() {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("AUTH CHECK");
    const connect = async () => {
      try {
        const auth = await axios
          .get(API + "/auth", { withCredentials: true })
          .then((res: AxiosResponse) => {
            return res.status;
          });

        if (auth === HttpStatusCode.Ok) {
          console.log("AUTH CHECK PASSED");
          setAuthStatus(true);
        } else {
          console.log("AUTH CHECK FAILED");
          setAuthStatus(false);
          navigate("/");
        }
      } catch (error) {
        console.log("AUTH CHECK FAILED");
        setAuthStatus(false);
        navigate("/");
      }
    };
    connect();
  }, []);

  console.log("AuthHelper render — authStatus:", authStatus);

  return (
    <IsAuthorized.Provider value={[authStatus, setAuthStatus]}>
      <Outlet />
    </IsAuthorized.Provider>
  );
}

export default AuthHelper;
