import { useReducer, useCallback, createContext } from "react";
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import AuthRoute from './utils/auth-route';
import PrivateRoute from './PrivateRoute';
import { CODE } from "./utils/session";

import Error from "./Error";

import WellcomePage from "./container/wellcome";
import SignupPage from "./container/signup";
import SigninPage from "./container/signin";
import RecoveryPage from "./container/recovery";
import RecoveryConfirmPage from "./container/recovery-confirm";
import SignupConfirmPage from "./container/signup-confirm";
import BalancePage from "./container/balance";
import NotificationPage from "./container/notification";
import SettingsPage from "./container/settings";
import ReceivePage from "./container/receive";
import SendPage from "./container/send";
import TransactionPage from "./container/transaction";

export type InitialState = {
  token: string | undefined;
  user: {
     email: string | undefined;
     isConfirm: false;
     id: number | undefined;
  };
};

type State = {
  token: string | undefined;
  user: {
     email: string | undefined;
     isConfirm: boolean;
     id: number | undefined;
  };
};

type Action = {
  type: ACTION_TYPE;
  payload?: any;
};

enum ACTION_TYPE {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

const stateReducer: React.Reducer<State, Action> = (
  state: State,
  action: Action
): State => {
  switch (action.type) {
     case ACTION_TYPE.LOGIN:
        const token = action.payload.token;
        const user = action.payload.user;
        return { ...state, token: token, user: user };
     case ACTION_TYPE.LOGOUT:
        window.localStorage.removeItem(CODE);
        return {
           ...state,
           token: undefined,
           user: {
              email: undefined,
              isConfirm: false,
              id: undefined,
           },
        };
     default:
        return { ...state };
  }
};
const initState: any = {
  token: undefined,
  user: {
     email: undefined,
     isConfirm: false,
     id: undefined,
  },
};
export const AuthContext = createContext(initState);

// =========================================================================
function App() {
  // console.log("render");
  // const session = getSession();

  const initState: InitialState = {
     token: undefined,
     user: {
        email: undefined,
        isConfirm: false,
        id: undefined,
     },
  };
  const initializer = (state: InitialState): State => {
     return {
        ...state,
        token: undefined,
        user: {
           email: undefined,
           isConfirm: false,
           id: undefined,
        },
     };
  };

  const [userState, dispach] = useReducer(
     stateReducer,
     initState,
     initializer
  );
  // eslint-disable-next-line
  const authDisp = useCallback(
     (type: string, session?: InitialState) => {
        // console.log(type, type === ACTION_TYPE.LOGIN);
        if (type === ACTION_TYPE.LOGIN) {
           dispach({ type: ACTION_TYPE.LOGIN, payload: session });
        }
        if (type === ACTION_TYPE.LOGOUT) {
           dispach({ type: ACTION_TYPE.LOGOUT });
        }
     },
     // eslint-disable-next-line
     [userState]
  );

  const authContextData = {
     userState: userState,
     authDisp: authDisp,
  };

  return ( 
    <AuthContext.Provider value={authContextData}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <AuthRoute>
                <WellcomePage />
              </AuthRoute>
            }
          />
          <Route path="/signup" element={
            <AuthRoute>
              <SignupPage />
            </AuthRoute>
            }
          />
          <Route path="/signup-confirm" element={
            <PrivateRoute>
              <SignupConfirmPage />
            </PrivateRoute>
            }
          />
          <Route path="/signin" element={
            <AuthRoute>
              <SigninPage />
            </AuthRoute>
            }
          />
          <Route path="/recovery" element={
            <AuthRoute>
              <RecoveryPage />
            </AuthRoute>
            }
          />
          <Route path="/recovery-confirm" element={
            <AuthRoute>
              <RecoveryConfirmPage />
            </AuthRoute>
          }
        />
        <Route
          path="/balance" element={
            <PrivateRoute>
              <BalancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <PrivateRoute>
              <NotificationPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/receive"
          element={
            <PrivateRoute>
              <ReceivePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/send"
          element={
            <PrivateRoute>
              <SendPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/transaction/:transactionId"
          element={
            <PrivateRoute>
              <TransactionPage />
            </PrivateRoute>
          }
        />
          <Route path="/*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>

  );
}

export default App;
