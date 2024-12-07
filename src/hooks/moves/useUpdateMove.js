import { useState } from "react";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const useUpdateMove = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateMove = async (moveID, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const moveRef = doc(db, "moves", moveID);
      await updateDoc(moveRef, updatedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateMove, loading, error };
};
