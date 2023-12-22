import React, { useState } from "react";
import eyeIcon from "../../svg/eye.svg";
import eyeCrossedIcon from "../../svg/cross-eye.svg";

import "./index.css";

type InputProps = {
  type: string;
  label: string;
  placeholder: string;
  action?: React.ChangeEventHandler<HTMLInputElement>;
  error: string | undefined;
  name: string;
  id: string | number;
  autoFocus?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  label,
  placeholder,
  action,
  error,
  name,  
  id,
}) => {

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPasswordInput = type === "password";

  return (
    <div className="field">
      <label className="label">{label}</label>
      <section className="field__section">
        <input
          className="field__input validation"
          name={name}
          placeholder={placeholder}
          type={isPasswordInput && showPassword ? "text" : type}
          autoFocus
          onChange={action}
          id={`${id}`}      

        />
        {isPasswordInput && (
          
            <button
              className="password-button"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <img src={eyeIcon} alt="Show password" />
              ) : (
                <img src={eyeCrossedIcon} alt="Hidden password" />
              )}
            </button>
         
        )}
      </section>
      {error && (
        <span id={`${name}--error`} className="form__error">{error}</span>
      )}
    </div>
  );
};

export default Input;
