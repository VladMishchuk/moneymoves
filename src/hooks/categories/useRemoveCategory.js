import { useState } from "react";
import { db } from "../../config/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export const useRemoveCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeCategory = async (moveID) => {
    setLoading(true);
    setError(null);
    try {
      const categoryRef = doc(db, "categories", moveID);
      await deleteDoc(categoryRef);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { removeCategory, loading, error };
};
