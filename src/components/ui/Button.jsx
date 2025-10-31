import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Button = ({ children, text, onClick, disabled, type = "button", className}) => {
  const {colors} = useTheme();
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={` ... ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      style={{color:colors.text,backgroundColor:colors.bgsoft}}

    >
      {text || children}
    </button>
  );
};

export default Button;
