import React, { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useAddMove } from "../../hooks/moves/useAddMove";
import { useAddCategory } from "../../hooks/categories/useAddCategory";
import { useGetCategories } from "../../hooks/categories/useGetCategories";
import { useAddAccount } from "../../hooks/accounts/useAddAccount";
import { useGetAccounts } from "../../hooks/accounts/useGetAccounts";
import CreatableSelect from "react-select/creatable";
import { Timestamp } from "@firebase/firestore";

export default function AddMoveForm() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [sum, setSum] = useState("");
  const [category, setCategory] = useState();
  const [account, setAccount] = useState();
  const [description, setDescription] = useState("");
  const { currentUser } = useAuth();
  const { addMove, loading } = useAddMove();
  const { addCategory } = useAddCategory();
  const { addAccount } = useAddAccount();
  const { categories, loading: categoriesLoading } = useGetCategories(
    currentUser?.uid
  );
  const { accounts, loading: accountsLoading } = useGetAccounts(
    currentUser?.uid
  );

  const handleCategoryChange = async (selectedOption) => {
    if (!selectedOption) {
      setCategory(null);
    } else if (selectedOption.__isNew__) {
      const newCategory = await addCategory({
        user: currentUser.uid,
        name: selectedOption.label,
      });
      setCategory({ value: newCategory.id, label: selectedOption.label });
    } else {
      setCategory({
        value: selectedOption.value,
        label: selectedOption.label,
      });
    }
  };

  const handleAccountChange = async (selectedOption) => {
    if (!selectedOption) {
      setAccount(null);
    } else if (selectedOption.__isNew__) {
      const newAccount = await addAccount({
        user: currentUser.uid,
        name: selectedOption.label,
      });
      setAccount({ value: newAccount.id, label: selectedOption.label });
    } else {
      setAccount({
        value: selectedOption.value,
        label: selectedOption.label,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let categoryId = category?.value;
    if (!categoryId) {
      if (category.label) {
        const newCategory = await addCategory({
          user: currentUser.uid,
          name: category.label,
        });
        categoryId = newCategory.id;
      }
    }

    let accountId = account?.value;
    if (!accountId) {
      if (account.label) {
        const newAccount = await addAccount({
          user: currentUser.uid,
          name: account.label,
        });
        accountId = newAccount.id;
      }
    }

    await addMove({
      user: currentUser.uid,
      date: Timestamp.fromDate(new Date(date)),
      sum,
      category: categoryId,
      account: accountId,
      description,
    });

    setDate(new Date().toJSON().slice(0, 10));
    setSum("");
    setCategory({});
    setAccount({});
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="addMoveForm">
      <label>
        <span>date:</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label>
        <span>sum:</span>
        <input
          placeholder="sum"
          type="number"
          step="0.01"
          value={sum}
          onChange={(e) => setSum(e.target.value)}
          required
        />
      </label>

      <label>
        <span>category:</span>
        <CreatableSelect
          isClearable
          placeholder={<div>category</div>}
          required
          isLoading={categoriesLoading}
          onChange={(selectedOption) => handleCategoryChange(selectedOption)}
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          value={category}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            border: "1px solid #ddd",
          })}
        />
      </label>

      <label>
        <span>account:</span>
        <CreatableSelect
          isClearable
          placeholder={<div>account</div>}
          required
          isLoading={accountsLoading}
          onChange={(selectedOption) => handleAccountChange(selectedOption)}
          options={accounts.map((account) => ({
            value: account.id,
            label: account.name,
          }))}
          value={account}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            border: "1px solid #ddd",
          })}
        />
      </label>

      <label>
        <span>description:</span>
        <input
          placeholder="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={loading || categoriesLoading || accountsLoading}
      >
        add move
      </button>
    </form>
  );
}
