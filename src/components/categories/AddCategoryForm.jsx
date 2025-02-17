import React, { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useAddCategory } from "../../hooks/categories/useAddCategory";

export default function AddCategoryForm() {
  const [name, setCategoryName] = useState("");
  const [project, setProject] = useState("");
  const { currentUser } = useAuth();
  const { addCategory, loading } = useAddCategory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addCategory({
      user: currentUser.uid,
      name,
      project,
    });

    setCategoryName("");
    setProject("");
  };

  return (
    <form onSubmit={handleSubmit} className="addCategoryForm">
      <label>
        <span>category:</span>
        <input
          placeholder="new category name"
          type="text"
          value={name}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
      </label>

      <label>
        <span>project:</span>
        <input
          placeholder="project"
          type="text"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        add category
      </button>
    </form>
  );
}
