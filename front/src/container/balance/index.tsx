import "./index.css";

import { AuthContext, InitialState } from "../../App";
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

import { Sceleton, Loader } from "../../component/sceleton";
import {
  stateServerReduser,
  requestInitialState,
  REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";
import Alert from "../../component/alert";
import { useNavigate } from "react-router-dom";

import Page from "../../page";
import Header from "../../component/header";
import ButtonIcon from "../../component/button-icon";
import Description from "../../component/description";
import Balance from "../../component/balance";
import ButtonRound from "../../component/button-round";
import TransactionList from "../../component/transaction-list";
// import TransactionItem from "../../component/transaction-item";
// import TransactionIcon from "../../component/transaction-icon";
// import TransactionTime from "../../component/transaction-time";
// import TransactionName from "../../component/transaction-name";
// import TransactionType from "../../component/transaction-type";
// import TransactionAmount from "../../component/transaction-amount";
// import AmountSplitter from "../../component/amount-splitter";

const TRANSACTION_TYPE = {
  SEND: "send",
  RECEIVE: "receive",
};

const DateResive = (timestamp: number) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const hour = hours < 10 ? `0` + hours : hours;
  const minut = minutes < 10 ? `0` + minutes : minutes;
  return (
     <>
        {hour}:{minut}
     </>
  );
};

export default function BalancePage() {
  
  const navigate = useNavigate();
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

   const getData = useCallback(async (userId: number) => {
      dispach({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
         const res = await fetch("http://localhost:4000/balance", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: convertSendData(userId),
         });

         const data = await res.json();

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
         const message = "Не можливо підключитись";
         dispach({
            type: REQUEST_ACTION_TYPE.ERROR,
            message: message,
         });
      }
      // eslint-disable-next-line
   }, []);

   const convertData = (data: { list: any[]; balance: number }) => ({
      list: data.list.reverse(),
      balance: data.balance,
      isEmpty: data.list.length === 0,
   });

   useEffect(() => {
      if (userId) {
         // console.log("1");
         getData(userId);
      }
      // eslint-disable-next-line
   }, []);
  

  return (
    <Page>
      <div className="balance-page">
        <Header>
          <ButtonIcon
            onClick={() =>{}}
            to="/settings"
            src="../../../svg/button-settings.svg"
            alt="Go to settings page"
          />
          <Description>Main wallet</Description>
          <ButtonIcon
            onClick={() => {}}
            to="/notification"
            src="../../../svg/button-notifications.svg"
            alt="Go to notifications page"
          />
        </Header>
        {state.status === REQUEST_ACTION_TYPE.PROGRESS && (
         //  <Balance>
         //    <Sceleton />
         //  </Balance>    
         <div className="balance-sceleton">
            <Sceleton />
         </div>          
         )}
        {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
          <Balance>$ {state.data.balance}</Balance>
        )}
        <div className="buttons-round">
          <div className="button-round-position">            
            <ButtonRound label="" onClick={() => {}} to="/receive" src="../../../svg/icon-receive.svg" alt="Receive" />  
            <span className="button-label">Receive</span>
          </div>
          <div className="button-round-position">            
            <ButtonRound label="" onClick={() => {}} to="/send" src="../../../svg/icon-send.svg" alt="Send" />  
            <span className="button-label">Send</span>
          </div>
        </div>
        <TransactionList>
        {state.status === REQUEST_ACTION_TYPE.PROGRESS && (
            <div className="balance-sceleton-block">
            <div className="balance-sceleton-height">
               <Sceleton />
            </div>
            <div className="balance-sceleton-height">
               <Sceleton />
            </div>
            <div className="balance-sceleton-height">
               <Sceleton />
            </div>
         </div>
      )}

      {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
         <Fragment>
            {state.data.isEmpty ? (
               <Alert message="Список транзакцій порожній" />
            ) : (
               state.data.list.map(
                  (item: {
                     date: number;
                     id: number;
                     userid: number;
                     type: string;
                     target: string;
                     summ: number;
                  }) => (
                     <Fragment key={item.id}>
                        <div
                           className={`transaction-list-item `}
                           onClick={() => {
                              navigate(`/transaction/:${item.id}`);
                           }}
                        >
                           <div
                              style={{
                                 display: "flex",
                                 gap: "12px",
                                 alignItems: "center",
                              }}
                           >
                              <div className="transaction-list-item__icon">
                                 {item.target === "coinbase" && (
                                    <img
                                       width={36}
                                       height={36}
                                       src="/svg/c-icon.svg"
                                       alt="Coinbase"
                                    ></img>
                                 )}
                                 {item.target === "stripe" && (
                                    <img
                                       width={36}
                                       height={36}
                                       src="/svg/s-icon.svg"
                                       alt="Stripe"
                                    ></img>
                                 )}
                                 {item.target !== "coinbase" &&
                                    item.target !== "stripe" && (
                                       <img
                                          width={36}
                                          height={36}
                                          src="/svg/p-icon.svg"
                                          alt="User"
                                       ></img>
                                    )}
                              </div>
                              <div className="transaction-list-item__hero">
                                 <p className="transaction-list-item__title">
                                    {item.target}
                                 </p>
                                 <p className="transaction-list-item__info">
                                    <span>{DateResive(item.date)}</span>
                                    {item.type ===
                                       TRANSACTION_TYPE.RECEIVE && (
                                       <span>Receipt</span>
                                    )}
                                    {item.type ===
                                       TRANSACTION_TYPE.SEND && (
                                       <span>Sending</span>
                                    )}
                                 </p>
                              </div>
                           </div>
                           {item.type === TRANSACTION_TYPE.RECEIVE && (
                              <div
                                 className={`transaction__summ  transaction__summ--recive }`}
                              >
                                 +${item.summ}
                              </div>
                           )}
                           {item.type === TRANSACTION_TYPE.SEND && (
                              <div
                                 className={`transaction__summ  transaction__summ--send }`}
                              >
                                 -${item.summ}
                              </div>
                           )}
                        </div>
                     </Fragment>
                  )
               )
            )}
         </Fragment>
      )}
        </TransactionList>
      </div>
      {state.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}
    </Page>
  );
}