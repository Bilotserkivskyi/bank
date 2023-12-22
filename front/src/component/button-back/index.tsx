// import React from "react";
// import { Link } from "react-router-dom";
// import "./index.css";

// class BackButton {
//   static back() {
//     return window.history.back();
//   }
// }

// window.backButton = BackButton;

// export default function Component({ to, src, alt }) {
//   return (
//     <Link to={to} className="button-back" onClick="backButton.back();">
//       <img src={src} alt={alt} />;
//     </Link>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

interface ButtonBackProps {
  to?: string;
  src: string;
  alt: string;
}

const ButtonBack: React.FC<ButtonBackProps> = ({ to, src, alt }) => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <button className="button-back" onClick={handleClick}>
      <img src={src} alt={alt} />
    </button>
  );
};

export default ButtonBack;
