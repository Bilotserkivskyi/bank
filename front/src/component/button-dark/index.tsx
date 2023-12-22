import "./index.css";
import React from "react";

type ButtonDarkProps = {
  children: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const ButtonDark: React.FC<ButtonDarkProps> = ({ children, onClick }) => {
  
  return (    
      <button
       
        className="button button-dark "
        onClick={onClick}
      >
        {children}
      </button>    
  );
};

export default ButtonDark;
