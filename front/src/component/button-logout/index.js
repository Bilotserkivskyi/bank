import "./index.css";

export default function Component({ children, onClick }) {
  return (
    <div className="button">
      <button className="button-logout" onClick={onClick}>
        {children}
      </button>
    </div>
  );
}
