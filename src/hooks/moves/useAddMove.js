import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export const useAddMove = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addMove = async ({ user, date, sum, category, description }) => {
    setLoading(true);
    setError(null);
    try {
      await addDoc(collection(db, "moves"), {
        user,
        date,
        sum: parseFloat(sum),
        category,
        description,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addMove, error, loading };
};
