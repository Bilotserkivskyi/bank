import React from "react";
import "./index.css";

const Component = ({ message, linkText, to }) => {
  return (
    <div className="link">
      {message}{" "}
      <a href={to} className="link-text">
        {linkText}
      </a>
    </div>
  );
};

export default Component;
