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

export function useGetAccounts(userId, addBalance = false) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    
    const q = query(collection(db, "accounts"), where("user", "==", userId), orderBy("name"));
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const newAccounts = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const accountData = {
              id: doc.id,
              ...doc.data(),
            };

            if (addBalance) {
              const movesSnapshot = await getDocs(query(
                collection(db, "moves"),
                where("user", "==", userId),
                where("account", "==", accountData.id)
              ));
              const balance = movesSnapshot.docs.reduce((sum, moveDoc) => {
                const { sum: moveSum } = moveDoc.data();
                return sum + (moveSum || 0);
              }, 0);

              return { ...accountData, balance };
            } else {
              return accountData;
            }
          })
        );

        setAccounts(newAccounts);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching accounts:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, addBalance]);

  return { accounts, loading, error };
}
