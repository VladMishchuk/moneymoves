import { useGetCategories } from "../../hooks/categories/useGetCategories";
import { useGetProjects } from "../../hooks/projects/useGetProjects";
import { useAddProject } from "../../hooks/projects/useAddProject";
import { useUpdateCategory } from "../../hooks/categories/useUpdateCategory";
import { useRemoveCategory } from "../../hooks/categories/useRemoveCategory";
import { useAuth } from "../../hooks/auth/useAuth";
import { Timestamp } from "@firebase/firestore";
import moment from "moment";
import { useState } from "react";
import Loader from "../Loader";
import CreatableSelect from "react-select/creatable";

export default function CategoriesList() {
  const { currentUser } = useAuth();
  const [periodStart, setPeriodStart] = useState(
    Timestamp.fromDate(new Date(moment().startOf("month").format("YYYY-MM-DD")))
  );
  const [periodEnd, setPeriodEnd] = useState(
    Timestamp.fromDate(new Date(moment().endOf("month").format("YYYY-MM-DD")))
  );
  const { categories, loading } = useGetCategories(
    currentUser?.uid,
    true,
    periodStart,
    periodEnd
  );
  const { updateCategory } = useUpdateCategory();
  const { removeCategory } = useRemoveCategory();
  const { projects, loading: projectsLoading } = useGetProjects(
    currentUser?.uid
  );
  const { addProject } = useAddProject();

  const handleProjectChange = async (categoryId, selectedOption) => {
    if (!selectedOption) return;
    let projectId;
    if (selectedOption.__isNew__) {
      console.log("here");
      const newProject = await addProject({
        user: currentUser.uid,
        name: selectedOption.label,
      });
      projectId = newProject.id;
    } else {
      projectId = selectedOption.value;
    }
    updateCategory(categoryId, { project: projectId });
  };

  return (
    <div className="categoriesTable-container">
      <form className="categoriesTable-form">
        {periodStart >= periodEnd ? (
          <p className="warning-period">check the first period</p>
        ) : (
          ""
        )}
        <label>
          <span>from:</span>
          <input
            type="date"
            value={
              new Date(periodStart.seconds * 1000).toISOString().split("T")[0]
            }
            onChange={(e) =>
              setPeriodStart(Timestamp.fromDate(new Date(e.target.value)))
            }
            required
          />
        </label>
        <label>
          <span>to:</span>
          <input
            type="date"
            value={
              new Date(periodEnd.seconds * 1000).toISOString().split("T")[0]
            }
            onChange={(e) =>
              setPeriodEnd(Timestamp.fromDate(new Date(e.target.value)))
            }
            required
          />
        </label>
      </form>

      {loading || projectsLoading ? (
        <Loader />
      ) : categories.length > 0 ? (
        <table className="categoriesTable">
          <thead>
            <tr>
              <th>category</th>
              <th>sum</th>
              <th>project</th>
              <th>plan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const projectById = projects.find(
                (project) => project.id === category.project
              );
              const project = projectById ? projectById.name : null;

              return (
                <tr key={category.id}>
                  <td>
                    <input
                      className="categoriesTable-input"
                      type="text"
                      placeholder="enter category name"
                      value={category.name}
                      onChange={(e) =>
                        updateCategory(category.id, { name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <span className="categoriesTable-span">{category.sum}</span>
                  </td>
                  <td>
                    <CreatableSelect
                      isClearable
                      placeholder={<div>project</div>}
                      value={{ value: category.project, label: project }}
                      onChange={(selectedOption) =>
                        handleProjectChange(category.id, selectedOption)
                      }
                      options={projects.map((project) => ({
                        value: project.id,
                        label: project.name,
                      }))}
                      styles={{
                        control: (stales) => ({
                          ...stales,
                          border: "1px solid #ddd",
                          borderRadius: 0,
                        }),
                        clearIndicator: (stales) => ({
                          ...stales,
                          display: "none",
                        }),
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="accountsTable-input"
                      type="number"
                      placeholder="enter plan sum"
                      value={category.plan}
                      onChange={(e) =>
                        updateCategory(category.id, {
                          plan: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="categoriesTable-remove"
                      onClick={() => removeCategory(category.id)}
                    >
                      <svg
                        height="20"
                        width="20"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        focusable="false"
                        className="categoriesTable-remove-svg"
                      >
                        <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No categories</p>
      )}
    </div>
  );
}
