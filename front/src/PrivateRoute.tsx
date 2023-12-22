import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./App";
import { saveSession } from "./utils/session";

type User = {
  token: string;
  user: {
     email: string;
     isConfirm: boolean;
     id: number;
  };
};

const PrivateRoute = ({ children }: any) => {
  const user = useContext(AuthContext);
   const userNext: User = user.userState;

   const token = userNext.token;

   useEffect(() => {
    if (token) {
       sendRequest(token, userNext.user.email);
    } else {
      console.log("token: null"); 
      user.authDisp("LOGOUT");      
    }

 }, []);

 const convertData = (token: string, email: string) => {
  return JSON.stringify({
     token: token,
     email: email,
  });
};

const sendRequest = async (token: string, email: string) => {
  try {
     const res = await fetch("http://localhost:4000/auth-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: convertData(token, email),
     });

     const data = await res.json();

     if (res.ok) {
      saveSession(data.session);
      user.authDisp({ type: "LOGIN", payload: data.session });
      return true;
   } else {
      user.authDisp("LOGOUT");
   }
  } catch (error) {
    console.log("Не підключено");

    user.authDisp("LOGOUT");
  }
};

  // Перевіряємо, чи є токен
  if (
    userNext.token &&
    !userNext.user.isConfirm &&
    window.location.pathname === "/signup-confirm"
 ) {
    return <>{children}</>;
 }
 if (
    userNext.token &&
    !userNext.user.isConfirm &&
    window.location.pathname !== "/signup-confirm"
 ) {    
    return <Navigate to="/signup-confirm" replace />;
 }
 if (userNext.token && userNext.user.isConfirm) {   
    return <>{children}</>;
 } else {
    return <Navigate to="/" replace />;
 }
};

export default PrivateRoute;