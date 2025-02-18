import React, { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useAddProject } from "../../hooks/projects/useAddProject";

export default function AddProjectForm() {
  const [name, setProjectName] = useState("");
  const [plan, setPlan] = useState("");
  const { currentUser } = useAuth();
  const { addProject, loading } = useAddProject();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProject({
      user: currentUser.uid,
      name,
      plan,
    });

    setProjectName("");
    setPlan("");
  };

  return (
    <form onSubmit={handleSubmit} className="addProjectForm">
      <label>
        <span>project:</span>
        <input
          placeholder="new project name"
          type="text"
          value={name}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
      </label>

      <label>
        <span>plan:</span>
        <input
          placeholder="plan"
          type="number"
          step="0.01"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        />
      </label>

      <button type="submit" disabled={loading}>
        add project
      </button>
      
    </form>
  );
}
