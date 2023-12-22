import React from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { saveSession } from "../../utils/session";
import { Form, REG_EXP_EMAIL } from "../../utils/form";
import {
   stateServerReduser,
   requestInitialState,
   REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";
import { Loader } from "../../component/sceleton";

import Page from "../../page";

import Heading from "../../component/heading";
import Title from "../../component/title";
import Grid from "../../component/grid";
import Description from "../../component/description";
import ButtonDark from "../../component/button-dark";
import ButtonBack from "../../component/button-back";
import Input from "../../component/input";
import Alert from "../../component/alert";

class RecoveryForm extends Form {
  FIELD_NAME = {
     EMAIL: "email",
  };

  FIELD_ERROR = {
     IS_EMPTY: "Введіть значення в поле",
     IS_BIG: "Занадто довге значення. Пориберіть зайве",
     EMAIL: "Значення e-mail адреси введене не коректно",
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
     return undefined;
  };
}
const recoveryForm = new RecoveryForm();

type InitialState = {
  names: { email: "" };
  errors: { email: "" };
};

type State = {
  names: { email: string | null };
  errors: { email: string | undefined };
};

type Action = {
  type: ACTION_TYPE;
  payload?: any;
  error?: string | undefined;
};

enum ACTION_TYPE {
  CHANGE_EMAIL = "CHANGE_EMAIL",
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
        recoveryForm.change("email", value);
        errors.email = error;
        names.email = value;
        return { ...state, names: names, errors: errors };
     case ACTION_TYPE.VALIDATE_ALL:
        const res: boolean = recoveryForm.validateAll();
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
     names: { email: "" },
     errors: { email: "" },
  };

  const initializer = (state: InitialState): State => ({
     ...state,
     names: { email: "" },
     errors: { email: "" },
  });

  const [state, dispach] = React.useReducer(
     stateReducer,
     initState,
     initializer
  );

  const handleInput: React.ChangeEventHandler<HTMLInputElement> | undefined = (
     e
  ) => {
     console.log(e.target.name, e.target.value);
     let error: string | undefined = recoveryForm.validate(
        e.target.name,
        e.target.value
     );
     console.log(error);
     if (e.target.name === "email") {
        dispach({
           type: ACTION_TYPE.CHANGE_EMAIL,
           payload: e.target.value,
           error: error,
        });
     }
  };

  React.useEffect(() => {
     recoveryForm.validateAll();
     recoveryForm.checkDisabled();
  }, [state]);

  const [stateServer, dispachServer] = React.useReducer(
     stateServerReduser,
     requestInitialState
  );

  const convertData = (data: { email: string }) => {
     return JSON.stringify({ email: data.email });
  };

  const sendData = async (dataToSend: { email: string }) => {
     dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });

     try {
        const res = await fetch("http://localhost:4000/recovery", {
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
           saveSession(data.session);
           navigate(`/recovery-confirm`);
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

  const handleSubmit = () => {
     const { email } = state.names;

     if (typeof email === "string" && recoveryForm.validateAll()) {
        sendData({ email });
     }
  };

  return (
    <Page>
      <div className="recovery-page">
        <ButtonBack
          to="/signin"
          src="../../../svg/button-back.svg"
          alt="Return back"
        />
        <Heading>
          <Title>Recovery password</Title>
          <Description>Choose a recovery method</Description>
        </Heading>
        
          <Input
            action={handleInput}
            name="email"
            type="email"
            label="Email"
            placeholder="Enter your email"            
            error={state.errors.email}
            id="recovery"
          />

          <Grid>
            <ButtonDark onClick={handleSubmit}>Send code</ButtonDark>
            {stateServer.status === REQUEST_ACTION_TYPE.PROGRESS && (
                  <Loader />
               )}

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
