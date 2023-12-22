import React, { ReactNode } from "react";
import "./index.css";

interface ComponentProps {
  children: ReactNode;
}

export default function Component({ children }: ComponentProps) {
  return <div className="transaction-list">{children}</div>;
}
