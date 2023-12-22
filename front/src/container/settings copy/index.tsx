import "./index.css";
import React, { useContext, useReducer } from "react";
import { AuthContext } from "../../App";
import { Form, REG_EXP_EMAIL, REG_EXP_PASSWORD } from "../../utils/form";
import {
   stateServerReduser,
   requestInitialState,
   REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";

import { saveSession } from "../../utils/session";

import Page from "../../page";
import Heading from "../../component/heading";
import Title from "../../component/title";
import ButtonLight from "../../component/button-light";
import ButtonBack from "../../component/button-back";
import Input from "../../component/input";
import ButtonLogout from "../../component/button-logout";
import TitleSection from "../../component/title-section";

import Divider from "../../component/divider";
import Alert from "../../component/alert";

// =====================================================
class ChangeForm extends Form {
  FIELD_NAME = {
    EMAIL: "email",
    EMAIL_NEW: "email_new",
    PASSWORD: "password",
    PASSWORD_NEW: "password_new",
  };

  FIELD_ERROR = {
     IS_EMPTY: "Введіть значення в поле",
     IS_BIG: "Занадто довге значення",
     EMAIL: "Email не корректний",
     PASSWORD:
        "Пароль повинен складатись не менше ніж з 8 символів, включаючи малі та Великі літери (Aa-Zz) та цифри(1-9)",
  };

  validate = (name: string, value: any): string | undefined => {
     if (String(value).length < 1) {
        return this.FIELD_ERROR.IS_EMPTY;
     }
     if (String(value).length > 30) {
        return this.FIELD_ERROR.IS_BIG;
     }

     if (name === this.FIELD_NAME.EMAIL || name === this.FIELD_NAME.EMAIL_NEW) {
        if (!REG_EXP_EMAIL.test(String(value)))
           return this.FIELD_ERROR.EMAIL;
     }     
   
     if (name === this.FIELD_NAME.PASSWORD || name === this.FIELD_NAME.PASSWORD_NEW) {
        if (!REG_EXP_PASSWORD.test(String(value)))
           return this.FIELD_ERROR.PASSWORD;
     }
     return undefined;
  };
}
const changeForm = new ChangeForm();

type InitialState = {
  names: { email: ""; email_new: ""; password: ""; password_new: "" };
  errors: { email: ""; email_new: ""; password: ""; password_new: "" };
};

type State = {
  names: {
    email: string | null;
    email_new: string | null;
    password: string | null;
    password_new: string | null;
  };
  errors: {
    email: string | undefined;
    email_new: string | undefined;
    password: string | undefined;
    password_new: string | undefined;
  };
};
// ====================================================

// ====================================================
export default function SettingsPage() {
  const context = useContext(AuthContext);
  const handleLogout = () => {
      context.authDisp("LOGOUT");
   };

   type Action = {
      type: ACTION_TYPE;
      payload?: any;
      error?: string | undefined;
   };
   
   enum ACTION_TYPE {
      CHANGE_EMAIL = "CHANGE_EMAIL",
      CHANGE_PASSWORD = "CHANGE_PASSWORD",
      CHANGE_PASSWORD_NEW = "CHANGE_PASSWORD_NEW",
   
      VALIDATE_ALL = "VALIDATE_ALL",
      SUBMIT = "SUBMIT",
   }
    

  const stateReducer: React.Reducer<State, Action> = (
    state: State,
    action: Action
  ): State => {
    const value = action.payload;
    const error = action.error;
    const errors = state.errors;
    const names = state.names;
  
    switch (action.type) {
       case ACTION_TYPE.CHANGE_EMAIL:
          changeForm.change("email_new", value);
          errors.email_new = error;
          names.email = value;
          return { ...state, names: names, errors: errors };
       case ACTION_TYPE.CHANGE_PASSWORD:
          changeForm.change("password", value);
          errors.password = error;
          names.password = value;
          return { ...state, names: names, errors: errors };
       case ACTION_TYPE.CHANGE_PASSWORD_NEW:
          changeForm.change("password_new", value);
          errors.password_new = error;
          names.password_new = value;
          return { ...state, names: names, errors: errors };
  
       case ACTION_TYPE.VALIDATE_ALL:
          const res: boolean = changeForm.validateAll();
          console.log(res);
  
          console.log("errors", errors);
  
          return { ...state, errors: errors };
       case ACTION_TYPE.SUBMIT:
          return { ...state, names };
       default:
          return state;
    }
  };
  
    const [stateServer, dispachServer] = useReducer(
       stateServerReduser,
       requestInitialState
    );
  
    // =====================================
    const initState: InitialState = {
       names: { email: "", email_new: "", password: "", password_new: "" },
       errors: { email: "", email_new: "", password: "", password_new: "" },
    };
  
    const initializer = (state: InitialState): State => ({
       ...state,
       names: { email: "", email_new: "", password: "",  password_new: "" },
       errors: { email: "",  email_new: "", password: "", password_new: "" },
    });
  
    const [state, dispach] = React.useReducer(
       stateReducer,
       initState,
       initializer
    );
  
    const sendData = async (dataToSend: {       
       email: string;
       email_new: string;
       password: string;
       password_new: string;
    }) => {
       dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });
  
       try {
          const res = await fetch("http://localhost:4000/settings", {
             method: "POST",
             headers: {
                "Content-Type": "application/json",
             },
             body: convertData(dataToSend),
          });
  
          const data = await res.json();
          // console.log(data);
          if (res.ok) {
             const message = "Success";
  
             dispachServer({
                type: REQUEST_ACTION_TYPE.SUCCESS,
                message: message,
             });
             saveSession(data.session);
             console.log("newUserData");
             userSession.authDisp("LOGIN", data.session);
          } else {
             dispachServer({
                type: REQUEST_ACTION_TYPE.ERROR,
                message: data.message,
             });
             console.log("error");
          }
       } catch (error) {
          const message = "Не можливо підключитись";
          dispachServer({
             type: REQUEST_ACTION_TYPE.ERROR,
             message: message,
          });
          console.log("send-error");
       }
    };
  
  const convertData = (data: {
   email: string;
   email_new: string;   
   password: string;
   password_new: string;
  }) => {
     return JSON.stringify({
        token: context.userState.token,
        email: data.email,
        email_new: data.email_new,
        password: data.password,
        password_new: data.password_new,
     });
  };
  let userSession = useContext(AuthContext);



  const handleSubmit = () => {
     const { email, email_new, password, password_new } = state.names;

     if (
        typeof email === "string" &&
        typeof email_new === "string" &&
        typeof password === "string" &&
        typeof password_new === "string" &&
        changeForm.validateAll()
     ) {
        sendData({ email, email_new, password, password_new });
     }
  };

  const handleInput: React.ChangeEventHandler<HTMLInputElement> | undefined = (
     e
  ) => {
     
     let error: string | undefined = changeForm.validate(
        e.target.name,
        e.target.value
     );
     
     if (e.target.name === "email_new") {
      dispach({
         type: ACTION_TYPE.CHANGE_EMAIL,
         payload: e.target.value,
         error: error,
      });
   }
   
     if (e.target.name === "password") {
        dispach({
           type: ACTION_TYPE.CHANGE_PASSWORD,
           payload: e.target.value,
           error: error,
        });
     }

     if (e.target.name === "password_new") {
      dispach({
         type: ACTION_TYPE.CHANGE_PASSWORD_NEW,
         payload: e.target.value,
         error: error,
      });
   }
  };

// ======================End============================

  return (
    <Page>
      <div className="settings-heading">
        <ButtonBack
          to="/balance"
          src="../../../svg/button-back.svg"
          alt="Return back"
        />
        <Heading>
          <Title>Settings</Title>
        </Heading>
      </div>
      <div className="email-section">
      
        <TitleSection>Change Email</TitleSection>
        <Input  
          action={handleInput}        
          name="email_new"
          label="Email"          
          type="email"
          placeholder="Enter your new email"
          error={state.errors.email}
          id={"email"}        
        />
        <Input
          action={handleInput}              
          name="password"
          label="Your password"          
          type="password"
          placeholder="Enter your password"
          error={state.errors.password}
          id={"change-email"}  
        />
        <ButtonLight onClick={handleSubmit}>Save Email</ButtonLight>
        {stateServer.status && (
               <Alert
                  status={stateServer.status}
                  message={stateServer.message}
               />
            )}
     
      </div>
      <Divider />
      <div className="password-section">
     
        <TitleSection>Change Password</TitleSection>
        <Input 
          action={handleInput}           
          name="password"
          label="Old Password"          
          type="password"
          placeholder="Enter your old password"
          error={state.errors.password}
          id={"password"}
        />

        <Input
          action={handleInput}
          name="password_new"
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          error={state.errors.password_new}
          id={"change-password"}
        />
        <ButtonLight onClick={handleSubmit}>Save Password</ButtonLight>
        {stateServer.status && (
               <Alert
                  status={stateServer.status}
                  message={stateServer.message}
               />
            )}
     
      </div>
      <Divider />

      <ButtonLogout onClick={handleLogout}>Logout</ButtonLogout>
    </Page>
  );
}
  

  
  