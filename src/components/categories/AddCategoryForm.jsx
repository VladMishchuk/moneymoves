import React, { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { useAddCategory } from "../../hooks/categories/useAddCategory";
import { useGetProjects } from "../../hooks/projects/useGetProjects";
import { useAddProject } from "../../hooks/projects/useAddProject";
import CreatableSelect from "react-select/creatable";

export default function AddCategoryForm() {
  const [name, setCategoryName] = useState("");
  const [project, setProject] = useState(null);
  const [plan, setPlan] = useState("");
  const { currentUser } = useAuth();
  const { addCategory, loading } = useAddCategory();
  const { projects, loading: projectsLoading } = useGetProjects(currentUser?.uid);
  const { addProject } = useAddProject();

  const handleProjectChange = async (selectedOption) => {
    if (!selectedOption) {
      setProject(null);
    } else if (selectedOption.__isNew__) {
      const newProject = await addProject({
        user: currentUser.uid,
        name: selectedOption.label,
      });
      setProject({ value: newProject.id, label: selectedOption.label });
    } else {
      setProject({
        value: selectedOption.value,
        label: selectedOption.label,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let projectId = project?.value;
    if (!projectId && project?.label) {
      const newProject = await addProject({
        user: currentUser.uid,
        name: project.label,
      });
      projectId = newProject.id;
    }

    await addCategory({
      user: currentUser.uid,
      name,
      project: projectId,
      plan
    });

    setCategoryName("");
    setProject(null);
    setPlan("");
  };

  return (
    <form onSubmit={handleSubmit} className="addCategoryForm">
      <label>
        <span>Category:</span>
        <input
          placeholder="New category name"
          type="text"
          value={name}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
      </label>

      <label>
        <span>Project:</span>
        <CreatableSelect
          isClearable
          placeholder={<div>Project</div>}
          isLoading={projectsLoading}
          onChange={(selectedOption) => handleProjectChange(selectedOption)}
          options={projects.map((project) => ({
            value: project.id,
            label: project.name,
          }))}
          value={project}
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

      <button type="submit" disabled={loading || projectsLoading}>
        Add Category
      </button>
    </form>
  );
}
