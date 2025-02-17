import { useState } from "react";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const useUpdateAccount = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAccount = async (moveID, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const moveRef = doc(db, "accounts", moveID);
      await updateDoc(moveRef, updatedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateAccount, loading, error };
};
