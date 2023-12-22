import React, { ReactNode } from 'react';
import "./index.css";

interface PageProps {
  children: ReactNode;
}

export default function Page({ children }: PageProps) {
  return (
    <main className="main">
      <div className="page">{children}</div>
    </main>
  );
}
