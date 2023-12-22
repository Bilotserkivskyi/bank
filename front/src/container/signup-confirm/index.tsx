import "./index.css";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";// Імпортуємо контекст аутентифікації

import Page from "../../page";

import Heading from "../../component/heading";
import Title from "../../component/title";

import Description from "../../component/description";
import ButtonDark from "../../component/button-dark";
import ButtonBack from "../../component/button-back";
import Alert from "../../component/alert";
import Input from "../../component/input";
import Grid from "../../component/grid";

import { saveSession } from "../../utils/session";

import { Form } from "../../utils/form";

import {
   stateServerReduser,
   requestInitialState,
   REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";

import { Loader } from "../../component/sceleton";

class SignupConfirmForm extends Form {
  FIELD_NAME = {
     CODE: "code",
  };

  FIELD_ERROR = {
     IS_EMPTY: "Введіть значення в поле",
     IS_BIG: "Занадто довге значення. Пориберіть зайве",
  };

  validate = (name: string, value: any): string | undefined => {
     if (String(value).length < 1) {
        return this.FIELD_ERROR.IS_EMPTY;
     }
     if (String(value).length > 30) {
        return this.FIELD_ERROR.IS_BIG;
     }
  };
}
const signupConfirmForm = new SignupConfirmForm();

// ================================================

type InitialState = {
  code: null;
  errors: { code: "" };
};

type State = {
  code: number | null;
  errors: { code: string | undefined };
};

type Action = {
  type: ACTION_TYPE;
  payload?: any;
  error?: string | undefined;
};

enum ACTION_TYPE {
  CHANGE_CODE = "CHANGE_CODE",
  VALIDATE_ALL = "VALIDATE_ALL",
}

const stateReducer: React.Reducer<State, Action> = (
  state: State,
  action: Action
): State => {
  const value = action.payload;
  const error = action.error;
  const errors = state.errors;

  switch (action.type) {
     case ACTION_TYPE.CHANGE_CODE:
        signupConfirmForm.change("code", value);
        errors.code = error;
        return { ...state, code: value, errors: errors };

     case ACTION_TYPE.VALIDATE_ALL:
        return { ...state, errors: errors };
     default:
        return state;
  }
};

export default function Container() {
  const navigate = useNavigate();
  let userSession = useContext(AuthContext);
  // const session = getSession();

  const initState: InitialState = {
     code: null,
     errors: { code: "" },
  };

  const initializer = (state: InitialState): State => ({
     ...state,
     code: null,
     errors: { code: "" },
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
     let error: string | undefined = signupConfirmForm.validate(
        e.target.name,
        e.target.value
     );
     // console.log(error);
     if (e.target.name === "code") {
        dispach({
           type: ACTION_TYPE.CHANGE_CODE,
           payload: e.target.value,
           error: error,
        });
     }
  };

  React.useEffect(() => {
     //console.log(state);
     signupConfirmForm.checkDisabled();
  }, [state]);

  const [stateServer, dispachServer] = React.useReducer(
     stateServerReduser,
     requestInitialState
  );

  // ==========

  const convertData = (data: { code: number }) => {
     return JSON.stringify({
        code: data.code,
        token: userSession.userState.token,
     });
  };
  const convertData1 = (data: { email: string }) => {
     return JSON.stringify({
        renew: true,
        email: userSession.userState.user.email,
     });
  };

  const sendData = async (dataToSend: { code: number }) => {
     dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });

     try {
        const res = await fetch("http://localhost:4000/signup-confirm/renew", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: convertData(dataToSend),
        });

        const data = await res.json();

        if (res.ok) {
           saveSession(data.session);
           dispachServer({
              type: REQUEST_ACTION_TYPE.SUCCESS,
              message: "Акаунт підтверджено",
           });
           userSession.authDisp("LOGIN", data.session);
           navigate(`/signin`, { replace: true });
        } else {
           dispachServer({
              type: REQUEST_ACTION_TYPE.ERROR,
              message: data.message,
           });
           // userSession.authDisp("LOGOUT");
           console.log(data.message, "error");
        }
     } catch (error) {
        const message = "Неможливо підключитись!";
        dispachServer({
           type: REQUEST_ACTION_TYPE.ERROR,
           message: message,
        });
        console.log("send-error");
     }
  };
  // ==============================

  const handleSubmit = () => {
     const code = state.code;
     // console.log(code != null);
     if (code != null && signupConfirmForm.validateAll()) {
        sendData({ code });
     } else {
        console.log("Data not sendet");
     }
  };
  const handleRenew = () => {
     const renew = true;
     const email = userSession.userState.user.email;
     if (typeof email === "string" && signupConfirmForm.validateAll()) {
        sendRequest({ renew, email });
     } else {
        console.error("data sending failed");
     }
  };
  // ====================================

  const sendRequest = async (dataToSend: {
     renew: boolean;
     email: string;
  }) => {
     dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });

     try {
        const res = await fetch(`http://localhost:4000/signup-confirm`, {
           method: "Post",
           headers: { "Content-Type": "application/json" },
           body: convertData1(dataToSend),
        });

        const data = await res.json();

        if (res.ok) {
           dispachServer({
              type: REQUEST_ACTION_TYPE.SUCCESS,
              message: "Код оновлено",
           });
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

  return (
    <Page>
      <div className="signup-confirm">
        <ButtonBack
          to="/"
          src="../../../svg/button-back.svg"
          alt="Return back"
        />

         {stateServer.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}
          <Heading>
            <Title>Confirm account</Title>
            <Description>Write the code you received</Description>
          </Heading>
          <Grid>
            <Input 
               action={handleInput}             
               name="code"
               type="text"
               label="Code"
               placeholder="Введіть 4-значний код"
               error={state.errors.code}
               autoFocus
               id="code"
            /> 

               <span className="link">
                  Lost code?
                  <button onClick={handleRenew} className="link-button" id="renew">
                     Send again
                  </button>
               </span>          
              
            <ButtonDark onClick={handleSubmit}>Confirm</ButtonDark>
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
}
