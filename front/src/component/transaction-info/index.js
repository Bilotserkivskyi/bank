import React from "react";
import "./index.css";

export default function Component({ label, value }) {
  return (
    <section className="transaction-info">
      <span className="transaction-label">{label}</span>
      <span className="transaction-value">{value}</span>
    </section>
  );
}
