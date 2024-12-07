import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

export function useGetBalance(userId, start = null, end = null) {
  const [balance, setBalance] = useState({
    balance: 0,
    incomes: 0,
    expences: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const q =
      start && end
        ? query(
            collection(db, "moves"),
            where("user", "==", userId),
            where("date", ">=", start),
            where("date", "<=", end)
          )
        : start
        ? query(
            collection(db, "moves"),
            where("user", "==", userId),
            where("date", ">=", start)
          )
        : end
        ? query(
            collection(db, "moves"),
            where("user", "==", userId),
            where("date", "<=", end)
          )
        : query(collection(db, "moves"), where("user", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let balance = 0;
        let incomes = 0;
        let expences = 0;

        snapshot.forEach((doc) => {
          const { sum } = doc.data();
          balance += sum;
          if (sum > 0) {
            incomes += sum;
          } else {
            expences += sum;
          }
        });

        setBalance({
          balance,
          incomes,
          expences,
        });
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, start, end]);

  return { balance, loading, error };
}
