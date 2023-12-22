import "./index.css";

export default function Picture({ src, name }) {
  return <img src={src} alt={name} className="picture" />;
}
