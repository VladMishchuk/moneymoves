import { useState } from "react";
import { db } from "../../config/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export const useRemoveAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeAccount = async (moveID) => {
    setLoading(true);
    setError(null);
    try {
      const categoryRef = doc(db, "accounts", moveID);
      await deleteDoc(categoryRef);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { removeAccount, loading, error };
};
