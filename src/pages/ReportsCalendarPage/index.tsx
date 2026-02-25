import ReportsHeader from "@/features/reports/components/ReportsHeader";
import css from "@/features/reports/index.module.css";

const ReportsCalendarPage = () => {
  return (
    <div className={css.pageContainer}>
      <ReportsHeader />
      <div className={css.contentRow}>
        <div className={css.mainContent}>
          <section className={css.calendarPlaceholder}>
            <p>Calendar view — logic to be implemented</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReportsCalendarPage;
