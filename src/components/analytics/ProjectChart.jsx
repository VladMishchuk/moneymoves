import { PieChart } from "@mui/x-charts/PieChart";
import { useGetProjects } from "../../hooks/projects/useGetProjects";
import { useAuth } from "../../hooks/auth/useAuth";
import Loader from "../Loader";
import { Timestamp } from "@firebase/firestore";
import moment from "moment";
import { useState } from "react";
import { useGetCategories } from "../../hooks/categories/useGetCategories";

export default function ProjectChart({ isExpenses = true }) {
  const { currentUser } = useAuth();
  const { projects, loading } = useGetProjects(currentUser?.uid);
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
      category.project == id ? (sum += isExpenses ? category.sum * -1 : category.sum) : sum
    );
    return sum;
  };

  const getRandomGray = () => {
    const shade = Math.floor(Math.random() * (200 - 50) + 50);
    return `rgb(${shade}, ${shade}, ${shade})`;
  };

  const chartData = projects
    .map((project) => ({
      id: project.id,
      value: getSumPerPeriodByProject(project.id),
      label: project.name,
      color: getRandomGray(),
    }))
    .filter((project) => project.value > 0);

  return (
    <div className="projectChat">
      <h2>{isExpenses ? "expenses" : "incomes"} by project</h2>
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
        chartData.length > 0 ? (
          <>
            <PieChart
              series={[{data: chartData,},]}
              height={250}
              sx={{ backgroundColor: "white", borderRadius: 2, padding: 1 }}
            />
          </>
        ) : (
          <p>No moves with projects in this period</p>
        )
      ) : (
        <p>No projects</p>
      )}
    </div>
  );
}
