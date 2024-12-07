import { useState } from "react";
import { db } from "../../config/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export const useRemoveMove = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeMove = async (moveID) => {
    setLoading(true);
    setError(null);
    try {
      const moveRef = doc(db, "moves", moveID);
      await deleteDoc(moveRef);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { removeMove, loading, error };
};
