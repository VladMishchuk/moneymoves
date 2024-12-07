import { useState } from "react";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const useUpdateCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCategory = async (moveID, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const moveRef = doc(db, "categories", moveID);
      await updateDoc(moveRef, updatedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateCategory, loading, error };
};
