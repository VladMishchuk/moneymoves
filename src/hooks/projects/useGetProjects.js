import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export function useGetProjects(userId, addBalance = false) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    
    const q = query(collection(db, "projects"), where("user", "==", userId), orderBy("name"));
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const newProjects = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const projectData = {
              id: doc.id,
              ...doc.data(),
            };

            if (addBalance) {
              const movesSnapshot = await getDocs(query(
                collection(db, "moves"),
                where("user", "==", userId),
                where("project", "==", projectData.id)
              ));
              const balance = movesSnapshot.docs.reduce((sum, moveDoc) => {
                const { sum: moveSum } = moveDoc.data();
                return sum + (moveSum || 0);
              }, 0);

              return { ...projectData, balance };
            } else {
              return projectData;
            }
          })
        );

        setProjects(newProjects);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching projects:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, addBalance]);

  return { projects, loading, error };
}
