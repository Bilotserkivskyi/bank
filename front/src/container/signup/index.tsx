import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

import Page from "../../page";
import Heading from "../../component/heading";
import Title from "../../component/title";
import Grid from "../../component/grid";
import Description from "../../component/description";
import ButtonDark from "../../component/button-dark";
import ButtonBack from "../../component/button-back";
import Alert from "../../component/alert";
import LinkButton from "../../component/link-button";
import Input from "../../component/input";
import { AuthContext } from "../../App";
import { Form, REG_EXP_EMAIL, REG_EXP_PASSWORD } from "../../utils/form";
import { saveSession } from "../../utils/session";

import {
  stateServerReduser,
  requestInitialState,
  REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";

import { Loader } from "../../component/sceleton";

class SignUpForm extends Form {
  FIELD_NAME = {
     EMAIL: "email",
     PASSWORD: "password",
     PASSWORD_AGAIN: "password_again",
  };

  FIELD_ERROR = {
     IS_EMPTY: "Введіть значення",
     IS_BIG: "Занадто довге значення",
     EMAIL: "Значення e-mail не коректне",
     PASSWORD:
        "Пароль повинен складатись не менше ніж з 8 символів, включаючи малі та Великі літери (Aa-Zz) та цифри(1-9)",
     PASSWORD_AGAIN:
        "Паролі не співпадають, перевірте коректність введення паролю",
  };

  validate = (name: string, value: any): string | undefined => {
     if (String(value).length < 1) {
        return this.FIELD_ERROR.IS_EMPTY;
     }
     if (String(value).length > 30) {
        return this.FIELD_ERROR.IS_BIG;
     }
     if (name === this.FIELD_NAME.EMAIL) {
        if (!REG_EXP_EMAIL.test(String(value))) {
           return this.FIELD_ERROR.EMAIL;
        }
     }
     if (name === this.FIELD_NAME.PASSWORD) {
        if (!REG_EXP_PASSWORD.test(String(value)))
           return this.FIELD_ERROR.PASSWORD;
     }
     if (name === this.FIELD_NAME.PASSWORD_AGAIN) {
        if (String(value) !== this.values[this.FIELD_NAME.PASSWORD])
           return this.FIELD_ERROR.PASSWORD_AGAIN;
     }
     return undefined;
  };
}
const signUpForm = new SignUpForm();

type InitialState = {
  names: { email: ""; password: ""; password_again: "" };
  errors: { email: ""; password: ""; password_again: "" };
};

type State = {
  names: {
     email: string | null;
     password: string | null;
     password_again: string | null;
  };
  errors: {
     email: string | undefined;
     password: string | undefined;
     password_again: string | undefined;
  };
};

type Action = {
  type: ACTION_TYPE;
  payload?: any;
  error?: string | undefined;
};

enum ACTION_TYPE {
  CHANGE_EMAIL = "CHANGE_EMAIL",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
  CHANGE_PASSWORD_AGAIN = "CHANGE_PASSWORD_AGAIN",

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
        signUpForm.change("email", value);
        errors.email = error;
        names.email = value;
        return { ...state, names: names, errors: errors };
     case ACTION_TYPE.CHANGE_PASSWORD:
        signUpForm.change("password", value);
        errors.password = error;
        names.password = value;
        return { ...state, names: names, errors: errors };
     case ACTION_TYPE.CHANGE_PASSWORD_AGAIN:
        signUpForm.change("password_again", value);
        errors.password_again = error;
        names.password_again = value;
        return { ...state, names: names, errors: errors };
     case ACTION_TYPE.VALIDATE_ALL:
        const res: boolean = signUpForm.validateAll();
        console.log(res);

        console.log("errors", errors);

        return { ...state, errors: errors };
     case ACTION_TYPE.SUBMIT:
        return { ...state, names };
     default:
        return state;
  }
};


export default function Container() {
  const navigate = useNavigate();

  const initState: InitialState = {
     names: { email: "", password: "", password_again: "" },
     errors: { email: "", password: "", password_again: "" },
  };

  const initializer = (state: InitialState): State => ({
     ...state,
     names: { email: "", password: "", password_again: "" },
     errors: { email: "", password: "", password_again: "" },
  });

  const [state, dispach] = React.useReducer(
     stateReducer,
     initState,
     initializer
  );

  const handleInput: React.ChangeEventHandler<HTMLInputElement> | undefined = (
     e
  ) => {
     // console.log(e.target.name, e.target.value);
     let error: string | undefined = signUpForm.validate(
        e.target.name,
        e.target.value
     );
     // console.log(error);
     if (e.target.name === "email") {
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
     if (e.target.name === "password_again") {
        dispach({
           type: ACTION_TYPE.CHANGE_PASSWORD_AGAIN,
           payload: e.target.value,
           error: error,
        });
     }
  };

  React.useEffect(() => {
     signUpForm.validateAll();
     signUpForm.checkDisabled();
  }, [state]);

  const [stateServer, dispachServer] = React.useReducer(
     stateServerReduser,
     requestInitialState
  );

  const convertData = (data: { email: string; password: string }) => {
     return JSON.stringify({ email: data.email, password: data.password });
  };
  let userSession = useContext(AuthContext);
  const sendData = async (dataToSend: { email: string; password: string }) => {
     dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });

     try {
        const res = await fetch("http://localhost:4000/signup", {
           method: "POST",
           headers: {
              "Content-Type": "application/json",
           },
           body: convertData(dataToSend),
        });

        const data = await res.json();
        if (res.ok) {
           const message = "Success";

           dispachServer({
              type: REQUEST_ACTION_TYPE.SUCCESS,
              payload: message,
           });
           saveSession(data.session);
           console.log("render newuser");
           userSession.authDisp("LOGIN", data.session);

           navigate(`/signup-confirm`, { replace: true });
        } else {
           dispachServer({
              type: REQUEST_ACTION_TYPE.ERROR,
              payload: data.message,
           });
           console.log("error");
        }
     } catch (error) {
        const message = "Неможливо підключитись";
        dispachServer({
           type: REQUEST_ACTION_TYPE.ERROR,
           payload: message,
        });
        console.log("send-error");
     }
  };

  const handleSubmit = () => {
     const { email, password } = state.names;

     if (
        typeof email === "string" &&
        typeof password === "string" &&
        signUpForm.validateAll()
     ) {
        sendData({ email, password });
     }
  };

  return (
    <Page>
      <div className="signup-page">
        
          <ButtonBack
            to="/"
            src="../../../svg/button-back.svg"
            alt="Return back"
          />
          {stateServer.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}

          <Heading>
            <Title>Sign up</Title>
            <Description>Choose a registration method</Description>
          </Heading>

          <Input 
            action={handleInput}           
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your e-mail"
            error={state.errors.email}
            id={"email"}
          />         

          <Input 
            action={handleInput}             
            name="password"
            type="password"
            label="Password"
            placeholder="Enter your password"                  
            error={state.errors.password}         
            id={"password"}
          />

          <Input 
            action={handleInput}             
            name="password_again"
            type="password"
            label="Password again"
            placeholder="Reply enter your password"                  
            error={state.errors.password_again}           
            id={"password-again"}
          />
          

          <LinkButton
            message="Already have an account?"
            linkText="Sign in"
            to="/signin"
          />

          <Grid>
            <ButtonDark onClick={handleSubmit}>Continue</ButtonDark>
              {stateServer.status && (
                  <Alert
                     status={stateServer.status}
                     message={stateServer.message}
                  />
               )}
          </Grid>
      
      </div>
    </Page>
  );
};
