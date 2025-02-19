import { useGetProjects } from "../../hooks/projects/useGetProjects";
import { useAuth } from "../../hooks/auth/useAuth";
import { useUpdateProject } from "../../hooks/projects/useUpdateProject";
import { useRemoveProject } from "../../hooks/projects/useRemoveProject";
import Loader from "../Loader";
import { Timestamp } from "@firebase/firestore";
import moment from "moment";
import { useState } from "react";
import { useGetCategories } from "../../hooks/categories/useGetCategories";

export default function ProjectsList() {
  const { currentUser } = useAuth();
  const { projects, loading } = useGetProjects(currentUser?.uid);
  const { updateProject } = useUpdateProject();
  const { removeProject } = useRemoveProject();
  const [periodStart, setPeriodStart] = useState(
    Timestamp.fromDate(new Date(moment().startOf("month").format("YYYY-MM-DD")))
  );
  const [periodEnd, setPeriodEnd] = useState(
    Timestamp.fromDate(new Date(moment().endOf("month").format("YYYY-MM-DD")))
  );
  const { categories, loading: categoriesLoading } = useGetCategories(
    currentUser?.uid,
    true,
    periodStart,
    periodEnd
  );

  const getSumPerPeriodByProject = (id) => {
    let sum = 0;
    categories?.forEach((category) =>
      category.project == id ? (sum += category.sum) : sum
    );
    return sum;
  };

  return (
    <div className="projectsTable-container">
      <form className="projectsTable-form">
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

      {loading || categoriesLoading ? (
        <Loader />
      ) : projects.length > 0 ? (
        <table className="projectsTable">
          <thead>
            <tr>
              <th>project</th>
              <th>sum</th>
              <th>plan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <input
                    className="projectsTable-input"
                    type="text"
                    placeholder="enter project name"
                    value={project.name}
                    onChange={(e) =>
                      updateProject(project.id, { name: e.target.value })
                    }
                  />
                </td>
                <td>
                  <span className="categoriesTable-span">
                    {getSumPerPeriodByProject(project.id)}
                  </span>
                </td>
                <td>
                  <input
                    className="projectsTable-input"
                    type="number"
                    placeholder="enter plan plan"
                    value={project.plan}
                    onChange={(e) =>
                      updateProject(project.id, {
                        plan: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td>
                  <button
                    className="projectsTable-remove"
                    onClick={() => removeProject(project.id)}
                  >
                    <svg
                      height="20"
                      width="20"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      focusable="false"
                      className="projectsTable-remove-svg"
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
        <p>No projects</p>
      )}
    </div>
  );
}
