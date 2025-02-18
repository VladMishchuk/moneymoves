import React, { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useAddAccount } from "../../hooks/accounts/useAddAccount";
import { Timestamp } from "@firebase/firestore";

export default function AddAccountForm() {
  const [name, setAccountName] = useState("");
  const { currentUser } = useAuth();
  const { addAccount, loading } = useAddAccount();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [plan, setPlan] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAccount({
      user: currentUser.uid,
      name,
      plan,
      date: Timestamp.fromDate(new Date(date)),
    });

    setDate(new Date().toJSON().slice(0, 10));
    setPlan("");
    setAccountName("");
  };

  return (
    <form onSubmit={handleSubmit} className="addAccountForm">
      <label>
        <span>account:</span>
        <input
          placeholder="new account name"
          type="text"
          value={name}
          onChange={(e) => setAccountName(e.target.value)}
          required
        />
      </label>

      <label>
        <span>plan:</span>
        <input
          placeholder="enter expected plan"
          type="number"
          step="0.01"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        />
      </label>

      <label>
        <span>deadline:</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <button type="submit" disabled={loading}>
        add account
      </button>
    </form>
  );
}
