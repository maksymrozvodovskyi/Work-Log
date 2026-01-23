import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { getWorkLogsByTime } from "@/api/worklogs";
import { WORKLOG_QUERY_KEYS } from "@/features/worklogs/queryKeys";
import {
  groupConsecutiveDates,
  getVacationStatus,
  type VacationPeriod,
} from "@/utils/dateUtils";
import Loader from "@/components/Loader";
import VacationColumn from "./components/VacationColumn";
import { VACATION_ACTIVITY_TYPES } from "./constants";
import css from "./VacationTab.module.css";

const VacationTab = () => {
  const { id: userId } = useParams<{ id: string }>();

  const { data: workLogsData, isLoading, isError } = useQuery({
    queryKey: [
      WORKLOG_QUERY_KEYS.worklogs,
      userId,
      undefined,
      undefined,
      "asc",
      VACATION_ACTIVITY_TYPES,
    ],
    queryFn: () =>
      getWorkLogsByTime(userId!, undefined, undefined, "asc", VACATION_ACTIVITY_TYPES),
    enabled: !!userId,
  });

  const vacationPeriods = workLogsData
    ? groupConsecutiveDates(workLogsData.projects.flatMap((p) => p.logs))
    : [];

  const used: VacationPeriod[] = [];
  const active: VacationPeriod[] = [];

  vacationPeriods.forEach((period) => {
    const status = getVacationStatus(period.startDate, period.endDate);
    if (status === "Used") used.push(period);
    else active.push(period);
  });

  used.sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
  active.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const usedVacations = used;
  const activeVacations = active;

  if (isLoading) {
    return (
      <div className={css.vacationTab}>
        <div className={css.loaderWrapper}>
          <Loader size="medium" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={css.vacationTab}>
        <div className={css.errorWrapper}>
          <span className={css.errorText}>Error loading vacations</span>
        </div>
      </div>
    );
  }

  return (
    <div className={css.vacationTab}>
      <div className={css.columns}>
        <VacationColumn
          title="Used"
          periods={usedVacations}
          emptyMessage="No used vacations"
        />
        <VacationColumn
          title="Active"
          periods={activeVacations}
          emptyMessage="No active vacations"
        />
      </div>
    </div>
  );
};

export default VacationTab;
