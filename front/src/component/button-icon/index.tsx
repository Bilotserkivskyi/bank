import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

interface ButtonIconProps {
  onClick: () => void;
  to: string;
  src: string;
  alt: string;
}

export default function ButtonIcon({
  onClick,
  to,
  src,
  alt,
}: ButtonIconProps) {
  return (
    <Link  to={to} onClick={onClick} className="button-icon">
      <img src={src} alt={alt} />
    </Link>
  );
}
