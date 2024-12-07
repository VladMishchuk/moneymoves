import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export const useAddCategory = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addCategory = async ({ user, name }) => {
    setLoading(true);
    setError(null);
    try {
      const categoryRef = await addDoc(collection(db, "categories"), {
        user,
        name,
      });
      return categoryRef;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addCategory, error, loading };
};
