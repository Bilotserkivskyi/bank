import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

import Page from "../../page";
import Heading from "../../component/heading";

import ButtonDark from "../../component/button-dark";
import ButtonBack from "../../component/button-back";
import Input from "../../component/input";
import InputSend from "../../component/input-send";
import Alert from "../../component/alert";

import { Form, REG_EXP_EMAIL } from "../../utils/form";
import {
   stateServerReduser,
   requestInitialState,
   REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";
import { AuthContext } from "../../App";
import { Loader } from "../../component/sceleton";
import Title from "../../component/title";

const TRANSACTION_TYPE = {
  SEND: "send",
  RECEIVE: "receive",
};

class SendForm extends Form {
  FIELD_NAME = {
     EMAIL: "email",
     SUMM: "SUMM",
  };

  FIELD_ERROR = {
     IS_EMPTY: "Введіть значення в поле",
     IS_BIG: "Занадто довге значення",
     EMAIL: "Значення e-mail адреси не коректно",
     IS_MINUS: "Значення має бути більше нуля",
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
     if (name === this.FIELD_NAME.SUMM && Number(value) < 0) {
        return this.FIELD_ERROR.IS_MINUS;
     }
     return undefined;
  };

  checkDisabled = () => {
     let disabled = true;

     Object.values(this.FIELD_NAME).forEach((name) => {
        if (this.error[name] || this.values[name] === undefined) {
           disabled = true;
        }

        const el = document.querySelector(`.button`);

        if (el) {
           el.classList.toggle("button--disabled", Boolean(disabled));
        }

        this.disabled = disabled;
     });

     this.disabled = disabled;
  };
}
const sendForm = new SendForm();

type InitialState = {
  names: { email: ""; summ: null };
  errors: { email: ""; summ: "" };
};

type State = {
  names: { email: string | null; summ: number | null };
  errors: { email: string | undefined; summ: string | undefined };
};

type Action = {
  type: ACTION_TYPE;
  payload?: any;
  error?: string | undefined;
};

enum ACTION_TYPE {
  CHANGE_EMAIL = "CHANGE_EMAIL",
  CHANGE_SUMM = "CHANGE_SUMM",

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
        sendForm.change("email", value);
        errors.email = error;
        names.email = value;
        return { ...state, names: names, errors: errors };
     case ACTION_TYPE.CHANGE_SUMM:
        sendForm.change("summ", value);
        errors.summ = error;
        names.summ = value;
        return { ...state, names: names, errors: errors };
     case ACTION_TYPE.VALIDATE_ALL:
        const res: boolean = sendForm.validateAll();
        console.log(res);

        console.log("errors", errors);

        return { ...state, errors: errors };
     case ACTION_TYPE.SUBMIT:
        return { ...state, names };
     default:
        return state;
  }
};

export default function SendPage() {
  const navigate = useNavigate();
  const initState: InitialState = {
     names: { email: "", summ: null },
     errors: { email: "", summ: "" },
  };

  const initializer = (state: InitialState): State => ({
     ...state,
     names: { email: "", summ: null },
     errors: { email: "", summ: "" },
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
     let error: string | undefined = sendForm.validate(
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
     if (e.target.name === "summ") {
        dispach({
           type: ACTION_TYPE.CHANGE_SUMM,
           payload: e.target.value,
           error: error,
        });
     }
  };

  const [stateServer, dispachServer] = React.useReducer(
     stateServerReduser,
     requestInitialState
  );

  // ==========

  const convertData = (data: {
     id: number;
     type: string;
     target: string;
     summ: number;
  }) => {
     return JSON.stringify({
        token: context.userState.token,
        id: data.id,
        type: data.type,
        target: data.target,
        summ: data.summ,
     });
  };
  let context = useContext(AuthContext);

  const sendData = async (dataToSend: {
     id: number;
     type: string;
     target: string;
     summ: number;
  }) => {
     dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });

     try {
        const res = await fetch("http://localhost:4000/send", {
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
              message: message,
           });
           navigate(`/balance`);
        } else {
           dispachServer({
              type: REQUEST_ACTION_TYPE.ERROR,
              message: data.message,
           });
           console.log("error");
        }
     } catch (error) {
        const message = "Неможливо підключитись";
        dispachServer({
           type: REQUEST_ACTION_TYPE.ERROR,
           message: message,
        });
        console.log("send-error");
     }
  };

  const handleSubmit = () => {
     const { email, summ } = state.names;

     if (typeof email === "string" && summ !== null && summ > 0) {
        sendData({
           id: context.userState.user.id,
           type: TRANSACTION_TYPE.SEND,
           target: email,
           summ: summ,
        });
     }
  };

  React.useEffect(() => {
     sendForm.validateAll();
     sendForm.checkDisabled();
  }, [state]);
  return (
    <Page>
      <div className="send-heading">
        <ButtonBack to="/balance" src="../../../svg/button-back.svg" alt="Go to back" />
        <Heading>
          <Title>Send</Title>
        </Heading>
      </div>
      <div className="send-page">
        
        <Input 
          action={handleInput}         
          name="email"
          label="Email"
          type="email"
          placeholder="Enter recipient's Email"
          error={state.errors.email}
          id={"send-email"}     
        />
        
        <InputSend
            action={handleInput}
            label="Sum"
            type="number"
            name="summ"
            placeholder="Введіть суму переказу"
            error={state.errors.summ}
            id={"send-summ"}
         />

        <ButtonDark onClick={handleSubmit}>Send</ButtonDark>
        {stateServer.status === REQUEST_ACTION_TYPE.PROGRESS && (
                  <Loader />
               )}

               {stateServer.status && (
                  <Alert
                     status={stateServer.status}
                     message={stateServer.message}
                  />
               )}
      </div>
    </Page>
  );
}