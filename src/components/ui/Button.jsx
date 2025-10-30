import React from "react";

const Button = ({ children, text, onClick, disabled, type = "button", className, style}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={` ... ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      style={style}

    >
      {text || children}
    </button>
  );
};

export default Button;
