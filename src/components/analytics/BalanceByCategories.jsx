import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useGetCategories } from "../../hooks/categories/useGetCategories";
import { Timestamp } from "@firebase/firestore";
import moment from "moment";
import Select from "react-select";

export default function BalanceByCategories() {
  const { currentUser } = useAuth();
  const [firstPeriodStart, setFirstPeriodStart] = useState(
    Timestamp.fromDate(new Date(moment().startOf("month").format("YYYY-MM-DD")))
  );
  const [firstPeriodEnd, setFirstPeriodEnd] = useState(
    Timestamp.fromDate(new Date(moment().endOf("month").format("YYYY-MM-DD")))
  );
  const [secondPeriodStart, setSecondPeriodStart] = useState(
    Timestamp.fromDate(
      new Date(
        // від поточної дати відняти один місяць, вирахувати початок того місяця
        moment().subtract(1, "month").startOf("month").format("YYYY-MM-DD")
      )
    )
  );
  const [secondPeriodEnd, setSecondPeriodEnd] = useState(
    Timestamp.fromDate(
      new Date(
        moment().subtract(1, "month").endOf("month").format("YYYY-MM-DD")
      )
    )
  );
  const { categories, loading } = useGetCategories(currentUser?.uid);
  const options = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));
  const [filter, setFilter] = useState([]); // список категорій в розрізі яких проводити аналітику
  const [balances, setBalances] = useState([]); // масив аналітик за категоріями

  const balanceByCategory = async (
    categoryId,
    categoryName,
    start,
    end,
    start2,
    end2
  ) => {
    const q = query(
      collection(db, "moves"),
      where("user", "==", currentUser?.uid),
      where("date", ">=", start),
      where("date", "<=", end),
      where("category", "==", categoryId)
    );

    const snapshot = await getDocs(q);

    let balance = 0,
      incomes = 0,
      expences = 0;
    snapshot.forEach((doc) => {
      const { sum } = doc.data();
      balance += sum;
      if (sum > 0) incomes += sum;
      else expences += sum;
    });

    const q2 = query(
      collection(db, "moves"),
      where("user", "==", currentUser?.uid),
      where("date", ">=", start2),
      where("date", "<=", end2),
      where("category", "==", categoryId)
    );

    const snapshot2 = await getDocs(q2);

    let balance2 = 0,
      incomes2 = 0,
      expences2 = 0;
    snapshot2.forEach((doc) => {
      const { sum } = doc.data();
      balance2 += sum;
      if (sum > 0) incomes2 += sum;
      else expences2 += sum;
    });

    return {
      category: categoryName,
      balance,
      incomes,
      expences,
      balance2,
      incomes2,
      expences2,
    };
  };

  const handleSelectChange = async (selectedOption) => {
    if (!filter.some((item) => item.value === selectedOption.value)) {
      setFilter([...filter, selectedOption]);

      const balanceData = await balanceByCategory(
        selectedOption.value,
        selectedOption.label,
        firstPeriodStart,
        firstPeriodEnd,
        secondPeriodStart,
        secondPeriodEnd
      );
      setBalances((prevBalances) => [...prevBalances, balanceData]);
    }
  };

  const removeItem = (itemToRemove) => {
    setFilter(filter.filter((item) => item.value !== itemToRemove.value));
    setBalances(
      balances.filter((balance) => balance.category !== itemToRemove.label)
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h2>moves by categories</h2>
      <form className="balanceByCategories-form">
        {firstPeriodStart >= firstPeriodEnd ? (
          <p className="warning-period">check the first period</p>
        ) : (
          ""
        )}
        <label>
          <span>first period start:</span>
          <input
            type="date"
            value={
              new Date(firstPeriodStart.seconds * 1000)
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setFirstPeriodStart(Timestamp.fromDate(new Date(e.target.value)))
            }
            required
          />
        </label>
        <label>
          <span>first period end:</span>
          <input
            type="date"
            value={
              new Date(firstPeriodEnd.seconds * 1000)
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setFirstPeriodEnd(Timestamp.fromDate(new Date(e.target.value)))
            }
            required
          />
        </label>
        {secondPeriodStart >= secondPeriodEnd ? (
          <p className="warning-period">check the second period</p>
        ) : (
          ""
        )}
        <label>
          <span>second period start:</span>
          <input
            type="date"
            value={
              new Date(secondPeriodStart.seconds * 1000)
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setSecondPeriodStart(Timestamp.fromDate(new Date(e.target.value)))
            }
            required
          />
        </label>
        <label>
          <span>second period end:</span>
          <input
            type="date"
            value={
              new Date(secondPeriodEnd.seconds * 1000)
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) =>
              setSecondPeriodEnd(Timestamp.fromDate(new Date(e.target.value)))
            }
            required
          />
        </label>
        <Select
          className="balanceByCategories-form-select"
          options={options}
          onChange={handleSelectChange}
          placeholder="select category"
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            border: "1px solid #ddd",
          })}
        />
        <div className="balanceByCategories-form-filter">
          {filter.map((item) => (
            <button
              className="balanceByCategories-form-filter-remove"
              key={item.value}
              onClick={() => removeItem(item)}
            >
              {item.label}
              <svg
                height="20"
                width="20"
                viewBox="0 0 20 20"
                aria-hidden="true"
                focusable="false"
                className="analyticsFilter-remove-svg"
              >
                <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
              </svg>
            </button>
          ))}
        </div>
      </form>
      {filter.length > 0 && (
        <table className="balanceByCategories-table">
          <thead>
            <tr>
              <th rowspan="2">category</th>
              <th colspan="3">
                {new Date(firstPeriodStart.seconds * 1000)
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join(".")}
                {" - "}
                {new Date(firstPeriodEnd.seconds * 1000)
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join(".")}
              </th>
              <th colspan="3">
                {new Date(secondPeriodStart.seconds * 1000)
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join(".")}
                {" - "}
                {new Date(secondPeriodEnd.seconds * 1000)
                  .toISOString()
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join(".")}
              </th>
              <th colSpan="3">change</th>
            </tr>
            <tr>
              <th>balance</th>
              <th>incomes</th>
              <th>expences</th>
              <th>balance</th>
              <th>incomes</th>
              <th>expences</th>
              <th>balance</th>
              <th>incomes</th>
              <th>expences</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((balance, index) => (
              <tr key={index}>
                <td>{balance.category}</td>
                <td>{balance.balance}</td>
                <td>{balance.incomes}</td>
                <td>{balance.expences}</td>
                <td>{balance.balance2}</td>
                <td>{balance.incomes2}</td>
                <td>{balance.expences2}</td>
                <td>{balance.balance + balance.balance2}</td>
                <td>{balance.incomes + balance.incomes2}</td>
                <td>{balance.expences + balance.expences2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
