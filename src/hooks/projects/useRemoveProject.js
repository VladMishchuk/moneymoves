import { useState } from "react";
import { db } from "../../config/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export const useRemoveProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const removeProject = async (moveID) => {
    setLoading(true);
    setError(null);
    try {
      const projectRef = doc(db, "projects", moveID);
      await deleteDoc(projectRef);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { removeProject, loading, error };
};
