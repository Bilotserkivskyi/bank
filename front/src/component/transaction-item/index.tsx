import "./index.css";
import React from "react";
import { Link } from "react-router-dom";
import AmountSplitter from "../../component/amount-splitter";
import { formatTimestamp } from "../Utils";


type TransactionProps = {
  transaction: {
    id: number;
    address: string;
    timestamp: string;
    name: string;
    amount: number;
  };
};

const TransactionItem: React.FC<TransactionProps> = ({ transaction }) => {

  const { id, address, timestamp, name, amount } = transaction;
  const { dollars: amountDoll, cents: amountCents } =
    AmountSplitter.splitAmount(amount);
  const time: string = formatTimestamp(timestamp);

  let icon = "";
  if (address === "Stripe") {
    icon = "./svg/s-icon.svg";
  } else if (address === "Coinbase") {
    icon = "./svg/c-icon.svg";
  } else {
    icon = "./svg/p-icon.svg";
  }

  return (
    <Link className="balance__transaction" to={`/transaction/${id}`}>
      <div className="transaction">
        <div className="transaction__info">
          <img className="transaction__img" src={icon} alt="Agent logo" />
          <div className="transaction__data">
            <div className="transaction__agent-name">{address}</div>
            <div className="transaction__details">
              <div className="transaction__time">{time}</div>
              <div className="transaction__type">{name}</div>
            </div>
          </div>
        </div>
        <div
          className={`transaction__amount ${
            name === "Sending" ? "minus" : "plus"
          }`}
        >
          {/* <span className="prefix">+$</span> */}
          <span className="doll">{amountDoll}</span>
          <span className="cents">{amountCents}</span>
        </div>
      </div>
    </Link>
  );
};

export default TransactionItem;
