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

export function useGetCategories(
  userId,
  addSum = false,
  dateFrom = null,
  dateTo = null
) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, "categories"),
      where("user", "==", userId),
      orderBy("name")
    );
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const newCategories = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const categoryData = {
              id: doc.id,
              ...doc.data(),
            };

            if (addSum && dateFrom && dateTo) {
              const movesSnapshot = await getDocs(
                query(
                  collection(db, "moves"),
                  where("user", "==", userId),
                  where("date", ">=", dateFrom),
                  where("date", "<=", dateTo),
                  where("category", "==", categoryData.id)
                )
              );
              let sum = 0;
              movesSnapshot.forEach((move) => {
                const { sum: sumFromMove } = move.data();
                sum += sumFromMove;
              });

              return { ...categoryData, sum };
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
  }, [userId, addSum]);

  return { categories, loading, error };
}
