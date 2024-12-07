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

export function useGetCategories(userId, addBalance = false) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    
    const q = query(collection(db, "categories"), where("user", "==", userId), orderBy("name"));
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const newCategories = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const categoryData = {
              id: doc.id,
              ...doc.data(),
            };

            if (addBalance) {
              const movesSnapshot = await getDocs(query(
                collection(db, "moves"),
                where("user", "==", userId),
                where("category", "==", categoryData.id)
              ));
              const balance = movesSnapshot.docs.reduce((sum, moveDoc) => {
                const { sum: moveSum } = moveDoc.data();
                return sum + (moveSum || 0);
              }, 0);

              return { ...categoryData, balance };
            } else {
              return categoryData;
            }
          })
        );

        setCategories(newCategories);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching categories:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, addBalance]);

  return { categories, loading, error };
}
