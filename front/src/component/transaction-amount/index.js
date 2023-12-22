import "./index.css";

export default function Component({ children }) {
  return (
    <span className="transaction-amount transaction-amount__sending transaction-amount__receipt">
      {children}
    </span>
  );
}
