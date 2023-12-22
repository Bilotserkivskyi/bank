import React, { Fragment, useContext, useEffect, useReducer  } from "react";
import "./index.css";

import Page from "../../page";

import ButtonBack from "../../component/button-back";
import Heading from "../../component/heading";
import Title from "../../component/title";
// import Divider from "../../component/divider";
import { AuthContext, InitialState } from "../../App";
import {
  REQUEST_ACTION_TYPE,
  requestInitialState,
  stateServerReduser,
} from "../../utils/serverReducer";
import { Loader } from "../../component/sceleton";
import Alert from "../../component/alert";
import TransactionList from "../../component/transaction-list";
// import TransactionIcon from "../../component/transaction-icon";
// import TransactionTime from "../../component/transaction-time";
// import TransactionName from "../../component/transaction-name";
// import TransactionType from "../../component/transaction-type";

const NOTIFIC_TYPE = {
  WARNING: "WARNING",
  INFO: "INFO",
};

const DateResive = (timestamp: number) => {
  const date1: number = timestamp;
  const dateNow: number = new Date().getTime();
  const diff: number = dateNow - date1;
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (minutes >= 1) {
     if (hours >= 1) {
        if (days >= 1) {
           return <>{Math.round(days)} days ago</>;
        }
        return <>{Math.round(hours)} hour ago</>;
     }
     return <>{Math.round(minutes)} min. ago</>;
  }
  return <>{Math.round(seconds)} sec. ago</>;
};

export default function NotificationsPage() {
  const context = useContext(AuthContext);
  const user: InitialState = context.userState;

  const userId = user.user.id;

  const [state, dispach] = useReducer(stateServerReduser, requestInitialState);

  const convertSendData = (userId: number) => {
     return JSON.stringify({
        userId: userId,
        token: user.token,
     });
  };

  const getData = async (userId: number) => {
     dispach({ type: REQUEST_ACTION_TYPE.PROGRESS });

     try {
        const res = await fetch(
           "http://localhost:4000/notification",
           {
              method: "POST",
              headers: {
                 "Content-Type": "application/json",
              },
              body: convertSendData(userId),
           }
        );

        const data = await res.json();
        // console.log(data);

        if (res.ok) {
           dispach({
              type: REQUEST_ACTION_TYPE.SUCCESS,
              payload: convertData(data),
           });
        } else {
           dispach({
              type: REQUEST_ACTION_TYPE.ERROR,
              message: data.message,
           });
        }

        // ===
     } catch (error) {
        const message = "Неможливо підключитись";
        dispach({
           type: REQUEST_ACTION_TYPE.ERROR,
           message: message,
        });
     }
  };

  const convertData = (data: { list: any[]; balance: number }) => ({
     list: data.list.reverse(),
     isEmpty: data.list.length === 0,
  });

  useEffect(() => {
     if (userId) {
        getData(userId);
     }
     // eslint-disable-next-line
  }, []);

  return (
    <Page>
      <div className="notifications-page">
        <div className="notifications-heading">
          <ButtonBack
            to="/balance"
            src="../../../svg/button-back.svg"
            alt="Return back"
          />
          <Heading>
            <Title>Notification</Title>
          </Heading>
        </div>

        <TransactionList>

        <div className="notification-list">
            {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
               <Fragment>
                  {state.data.isEmpty ? (
                     <Alert message="Список повідомлень пустий" />
                  ) : (
                     state.data.list.map(
                        (item: {
                           id: number;
                           type: string;
                           text: string;
                           date: number;
                        }) => (
                           <Fragment key={item.id}>
                              <div className="notification-item">
                                 <div className="notification-item__logo">
                                    {item.type === NOTIFIC_TYPE.WARNING && (
                                       <img
                                          src="../../../svg/warning-icon.svg"
                                          alt="warning"
                                          width={36}
                                          height={36}
                                       />
                                    )}
                                    {item.type === NOTIFIC_TYPE.INFO && (
                                       <img
                                          src="../../../svg/bell-icon.svg"
                                          alt="info"
                                          width={36}
                                          height={36}
                                       />
                                    )}
                                 </div>
                                 <div className="notification-item__hero">
                                    <p className="notification-item__title">
                                       {item.text}
                                    </p>
                                    <p className="notification-item__info">
                                       <span>{DateResive(item.date)}</span>
                                       {item.type === NOTIFIC_TYPE.WARNING && (
                                          <span>{item.type}</span>
                                       )}
                                       {item.type === NOTIFIC_TYPE.INFO && (
                                          <span>Announcement</span>
                                       )}
                                    </p>
                                 </div>
                              </div>
                              
                             
                           </Fragment>
                        )
                     )
                  )}
               </Fragment>
            )}
         </div>

         {state.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}
        </TransactionList>
      </div>
    </Page>
    );
  }