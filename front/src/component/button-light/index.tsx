import "./index.css";
import React from "react";

type ButtonLightProps = {
  children: string,
  onClick: React.MouseEventHandler<HTMLButtonElement>
};

const ButtonLight: React.FC<ButtonLightProps> = ({ children, onClick }) => {
  return (
    
      <button onClick={onClick} className="button button-light">
        {children}
      </button>
   
  );
};

export default ButtonLight;
