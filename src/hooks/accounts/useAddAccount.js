import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export const useAddAccount = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addAccount = async ({ user, name, date, sum }) => {
    setLoading(true);
    setError(null);
    try {
      const categoryRef = await addDoc(collection(db, "accounts"), {
        user,
        name,
        date,
        sum,
      });
      return categoryRef;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addAccount, error, loading };
};
