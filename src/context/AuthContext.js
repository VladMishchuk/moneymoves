import { createContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useLogin } from "../hooks/auth/useLogin";
import { useSignup } from "../hooks/auth/useSignup";
import { useLogout } from "../hooks/auth/useLogout";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const { loginWithEmail, loginWithGoogle, loading: loginLoading, error: loginError } = useLogin();
  const { signupWithEmail, signupWithGoogle, loading: signupLoading, error: signupError } = useSignup();
  const { logout, loading: logoutLoading, error: logoutError } = useLogout();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loginError || signupError || logoutError) {
      setError(loginError || signupError || logoutError);
    } else {
      setError(null);
    }
  }, [loginError, signupError, logoutError]);

  const authLoading = loading || loginLoading || signupLoading || logoutLoading;

  const value = {
    currentUser,
    loginWithEmail,
    loginWithGoogle,
    signupWithEmail,
    signupWithGoogle,
    logout,    
    loading: authLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}