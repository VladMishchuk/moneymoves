import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useGetBalance } from "../../hooks/analytics/useGetBalance";
import { Timestamp } from "@firebase/firestore";
import moment from "moment";

export default function BalanceForDate() {
  const { currentUser } = useAuth();
  const [firstDate, setFirstDate] = useState(
    Timestamp.fromDate(new Date(moment().format("YYYY-MM-DD")))
  );
  const [secondDate, setSecondDate] = useState(
    Timestamp.fromDate(
      new Date(
        // від поточної дати відняти один день
        moment().subtract(1, "day").format("YYYY-MM-DD")
      )
    )
  );

  const {
    balance: firstBalance,
    loading: firstLoading,
  } = useGetBalance(currentUser?.uid, null, firstDate);

  const {
    balance: secondBalance,
    loading: secondLoading,
  } = useGetBalance(currentUser?.uid, null, secondDate);

  if (firstLoading || secondLoading) return <p>Loading...</p>;

  return (
    <>
      <h2>balances by dates</h2>
      <form>
        <label>
          <span>first date:</span>
          <input
            type="date"
            value={
              new Date(firstDate.seconds * 1000).toISOString().split("T")[0]
            }
            onChange={(e) =>
              setFirstDate(Timestamp.fromDate(new Date(e.target.value)))
            }
            required
          />
        </label>
        <label>
          <span>second date:</span>
          <input
            type="date"
            value={
              new Date(secondDate.seconds * 1000).toISOString().split("T")[0]
            }
            onChange={(e) =>
              setSecondDate(Timestamp.fromDate(new Date(e.target.value)))
            }
            required
          />
        </label>
      </form>

      <table className="balanceForDate-table">
        <thead>
          <tr>
            <th colSpan="3"> {
                new Date(firstDate.seconds * 1000)
                  .toISOString()
                  .split("T")[0].split('-').reverse().join('.')
              }</th>
            <th colSpan="3"> {
                new Date(secondDate.seconds * 1000)
                  .toISOString()
                  .split("T")[0].split('-').reverse().join('.')
              }</th>
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
          <tr>
            <td>{firstBalance?.balance}</td>
            <td>{firstBalance?.incomes}</td>
            <td>{firstBalance?.expences}</td>
            <td>{secondBalance?.balance}</td>
            <td>{secondBalance?.incomes}</td>
            <td>{secondBalance?.expences}</td>
            <td>{firstBalance?.balance - secondBalance?.balance}</td>
            <td>{firstBalance?.incomes - secondBalance?.incomes}</td>
            <td>{firstBalance?.expences - secondBalance?.expences}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
