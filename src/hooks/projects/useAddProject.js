import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export const useAddProject = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const addProject = async ({ user, name, plan = 0}) => {
    setLoading(true);
    setError(null);
    try {
      const projectRef = await addDoc(collection(db, "projects"), {
        user,
        name,
        plan,
      });
      return projectRef;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addProject, error, loading };
};
