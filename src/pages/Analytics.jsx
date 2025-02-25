import Header from "../components/Header";
import CurrentBalance from "../components/analytics/CurrentBalance";
import MovesForPeriod from "../components/analytics/MovesForPeriod";
import BalanceForDate from "../components/analytics/BalanceForDate";
import BalanceByCategories from "../components/analytics/BalanceByCategories";
import ProjectChart from "../components/analytics/ProjectChart";

export default function Analytics() {
  return (
    <>
      <Header />
      <main className="analytics">
        <div className="projectChats-container">
          <ProjectChart isExpenses={true} />
          <ProjectChart isExpenses={false} />
        </div>
        {/* поточний баланс */}
        <CurrentBalance />
        {/* баланси на дату */}
        <BalanceForDate />
        {/* рухи за періоди */}
        <MovesForPeriod />
        {/* баланси по категоріях */}
        <BalanceByCategories />
      </main>
    </>
  );
}
