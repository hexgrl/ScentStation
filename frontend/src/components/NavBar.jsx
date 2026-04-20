import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">ScentStation</Link>
      <div className="navbar-auth">
        {user === undefined ? null : user ? (
          <>
            <Link to="/collection">Collection</Link>
            <span>{user.email}</span>
            <button onClick={logout}>Log out</button>
          </>
        ) : (
          <a href="http://localhost:3001/auth/google">Log in with Google</a>
        )}
      </div>
    </nav>
  );
}