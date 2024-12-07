import React from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useGetBalance } from "../../hooks/analytics/useGetBalance";

export default function CurrentBalance() {
  const { currentUser } = useAuth();
  const { balance } = useGetBalance(currentUser?.uid);

  return (
    <>
      <h2>current balance</h2>
      <table className="currentBalance-table">
        <thead>
          <tr>
            <th>balance</th>
            <th>incomes</th>
            <th>expences</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{balance.balance}</td>
            <td>{balance.incomes}</td>
            <td>{balance.expences}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}