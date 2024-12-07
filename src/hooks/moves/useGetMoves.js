import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebase";

export function useGetMoves(userId) {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, "moves"),
        where("user", "==", userId),
        orderBy("date", "desc")
      );

      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          const newMoves = await Promise.all(
            snapshot.docs.map(async (doc) => {
              return { id: doc.id, ...doc.data() };
            })
          );
          setMoves(newMoves);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching moves:", err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [userId]);

  return { moves, loading, error };
}
