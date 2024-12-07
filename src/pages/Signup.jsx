import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logout, currentUser, signupWithEmail, signupWithGoogle, error } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      await signupWithEmail(email, password);
      navigate("/");
    } catch (error) {
      console.error("Error signing up with email and password: ", error);
    }
  };

  const handleSignUpWithGoogle = () => {
    try {
      signupWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Error signing up with Google: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error to logout: ", error);
    }
  };

  const handleMoves = async () => {
    try {
      navigate("/moves");
    } catch (error) {
      console.error("Error to back to moves: ", error);
    }
  };

  return (
    <>
      {currentUser ? (
        <form className="alreadySignedUp-form">
        {error && <p className="error">{error}</p>}
          <p>You are already logged in as {currentUser.email}</p>
          <div className="flex-container">
            <button onClick={handleSignOut}>logout</button>
            <button onClick={handleMoves}>moves</button>
          </div>
        </form>
      ) : (
        <>
          <form className="signupForm" onSubmit={handleSignUp}>
          {error && <p className="error">{error}</p>}
            <label htmlFor="email">email:</label>
            <input
              id="email"
              placeholder="enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">password:</label>
            <input
              id="password"
              placeholder="enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">sign up</button>
            <button type="button" onClick={handleSignUpWithGoogle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18"
                viewBox="0 0 24 24"
                width="18"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>{" "}
              sign up with Google
            </button>
            <p>
              already have an account? <Link className="link" to="/login">login</Link>
            </p>
          </form>
        </>
      )}
    </>
  );
}
