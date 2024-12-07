import { useState } from "react";
import { auth, providerGoogle } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const signupWithEmail = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, providerGoogle);
      return result.user;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { signupWithEmail, signupWithGoogle, loading, error };
};
