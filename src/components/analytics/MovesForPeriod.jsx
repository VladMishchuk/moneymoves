import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useGetBalance } from "../../hooks/analytics/useGetBalance";
import { Timestamp } from "@firebase/firestore";
import moment from "moment";

export default function MovesForPeriod() {
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

  const {
    balance: firstBalance,
    loading: firstLoading,
  } = useGetBalance(currentUser?.uid, firstPeriodStart, firstPeriodEnd);

  const {
    balance: secondBalance,
    loading: secondLoading,
  } = useGetBalance(currentUser?.uid, secondPeriodStart, secondPeriodEnd);

  if (firstLoading || secondLoading) return <p>Loading...</p>;

  return (
    <>
    <h2>moves for periods</h2>
      <form className="movesForPeriod-form">
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
      </form>

      <table className="balanceForDate-table">
        <thead>
          <tr>
          <th colSpan="3">
              {
                new Date(firstPeriodStart.seconds * 1000)
                  .toISOString()
                  .split("T")[0].split('-').reverse().join('.')
              }
              {" - "}
              {
                new Date(firstPeriodEnd.seconds * 1000)
                  .toISOString()
                  .split("T")[0].split('-').reverse().join('.')
              }
            </th>
            <th colSpan="3">
            {
                new Date(secondPeriodStart.seconds * 1000)
                  .toISOString()
                  .split("T")[0].split('-').reverse().join('.')
              }
              {" - "}
              {
                new Date(secondPeriodEnd.seconds * 1000)
                  .toISOString()
                  .split("T")[0].split('-').reverse().join('.')
              }
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


