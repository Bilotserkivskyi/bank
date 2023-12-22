import { Link } from "react-router-dom";
import "./index.css";

interface ButtonRoundProps {
  onClick: () => void;
  label: string;
  to: string;
  src: string;
  alt: string;
}

export default function ButtonRound({
 
  label,
  onClick,
  to,
  src,
  alt,
}: ButtonRoundProps) {
  return (
    <span className="button-round">
      <Link  to={to} onClick={onClick} className="button-round-icon button-round-position">
        <img src={src} alt={alt} />
      </Link>
      {label}
    </span>
  );
}