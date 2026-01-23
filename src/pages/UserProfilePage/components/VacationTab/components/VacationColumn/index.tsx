import type { VacationPeriod } from "@/utils/dateUtils";
import VacationCard from "../VacationCard";
import css from "../../VacationTab.module.css";

type VacationColumnPropsType = {
  title: string;
  periods: VacationPeriod[];
  emptyMessage: string;
};

const VacationColumn = ({ title, periods, emptyMessage }: VacationColumnPropsType) => (
  <div className={css.column}>
    <h3 className={css.columnTitle}>{title}</h3>
    <div className={css.cardsList}>
      {periods.length === 0 && (
        <div className={css.emptyState}>{emptyMessage}</div>
      )}
      {periods.length > 0 && periods.map((period) => (
        <VacationCard
          key={`${period.startDate.getTime()}-${period.endDate.getTime()}-${period.type}`}
          period={period}
        />
      ))}
    </div>
  </div>
);

export default VacationColumn;

