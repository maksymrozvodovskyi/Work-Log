import type { VacationPeriod } from "@/utils/dateUtils";
import { formatDateRange } from "@/utils/dateUtils";
import { VACATION_TYPE_MAP } from "../../constants";
import css from "../../VacationTab.module.css";

type VacationCardPropsType = {
  period: VacationPeriod;
};

const VacationCard = ({ period }: VacationCardPropsType) => {
  const typeInfo = VACATION_TYPE_MAP[period.type];

  return (
    <div className={css.card}>
      <div className={css.cardHeader}>
        <span className={css.cardType} style={{ color: typeInfo.color }}>
          {typeInfo.label}
        </span>
      </div>
      <div className={css.cardDuration}>{period.days} d</div>
      <div className={css.cardDate}>
        {formatDateRange(period.startDate, period.endDate)}
      </div>
    </div>
  );
};

export default VacationCard;

