import { useGetAccounts } from "../../hooks/accounts/useGetAccounts";
import { useAuth } from "../../hooks/auth/useAuth";
import { useUpdateAccount } from "../../hooks/accounts/useUpdateAccount";
import { useRemoveAccount } from "../../hooks/accounts/useRemoveAccount";
import Loader from "../Loader";
import { Timestamp } from "@firebase/firestore";

export default function AccountsList() {
  const { currentUser } = useAuth();
  const { accounts, loading } = useGetAccounts(currentUser?.uid, true);
  const { updateAccount } = useUpdateAccount();
  const { removeAccount } = useRemoveAccount();

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {accounts.length > 0 ? (
        <table className="accountsTable">
          <thead>
            <tr>
              <th>account</th>
              <th>balance</th>
              <th>plan</th>
              <th>deadline</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>
                  <input
                    className="accountsTable-input"
                    type="text"
                    placeholder="enter account name"
                    value={account.name}
                    onChange={(e) =>
                      updateAccount(account.id, { name: e.target.value })
                    }
                  />
                </td>
                <td>
                  <span className="accountsTable-span">{account.balance}</span>
                </td>
                <td> 
                  <input
                    className="accountsTable-input"
                    type="number"
                    placeholder="enter plan sum"
                    value={account.sum}
                    onChange={(e) =>
                      updateAccount(account.id, {
                        sum: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td>
                    <input
                      className="movesTable-input"
                      type="date"
                      value={ account.date != undefined ?
                        new Date(account.date.seconds * 1000)
                          .toISOString()
                          .split("T")[0]
                          : 0
                      }
                      onChange={(e) =>
                        updateAccount(account.id, {
                          date: Timestamp.fromDate(new Date(e.target.value)),
                        })
                      }
                    />
                  </td>
                <td>
                  <button
                    className="accountsTable-remove"
                    onClick={() => removeAccount(account.id)}
                  >
                    <svg
                      height="20"
                      width="20"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      focusable="false"
                      className="accountsTable-remove-svg"
                    >
                      <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No accounts</p>
      )}
    </>
  );
}
