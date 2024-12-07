import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function useGetBalanceByCategory(userId, start, end, categories) {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const q = query(
              collection(db, "moves"),
              where("user", "==", userId),
              where("date", ">=", start),
              where("date", "<=", end),
              where("category", "==", category.id)
            );
            const snapshot = await getDocs(q);

            let total = 0, positive = 0, negative = 0;
            snapshot.forEach((doc) => {
              const { sum } = doc.data();
              total += sum;
              if (sum > 0) positive += sum;
              else negative += sum;
            });

            return { category: category.name, total, positive, negative };
          })
        );
        setBalances(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categories, userId, start, end]);

  return { balances, loading, error };
}
