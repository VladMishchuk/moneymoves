import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/auth/useLogout";


export default function Header() {
  const { logout } = useLogout();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    logout();
    navigate("/login");
  };

  return (
    <header>
      <h1>moneymoves</h1>
      <nav>
        <ul>
          <li>
            <Link to="/moves">moves</Link>
          </li>
          <li>
            <Link to="/categories">categories</Link>
          </li>
          <li>
            <Link to="/analytics">analytics</Link>
          </li>
        </ul>
      </nav>
      <button onClick={handleSignOut}>sign out</button>
    </header>
  );
}
