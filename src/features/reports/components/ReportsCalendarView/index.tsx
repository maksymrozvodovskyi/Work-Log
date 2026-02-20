import { ReportsCalendar } from "@/features/reports/components/ReportsCalendar";
import { ReportsTimeline } from "@/features/reports/components/ReportsTimeline";
import type { UserRangeType } from "@/types/User";
import type { ReportType, ReportsCountsType } from "@/api/reports";
import css from "./ReportsCalendarView.module.css";

type ReportsCalendarViewPropsType = {
  selectedDate: Date;
  users: UserRangeType[];
  counts: ReportsCountsType;
  selectedReportType: ReportType | null;
  search: string;
  onDateChange: (date: Date) => void;
  onReportTypeChange: (type: ReportType | null) => void;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
};

export const ReportsCalendarView = ({
  selectedDate,
  users,
  counts,
  selectedReportType,
  search,
  onDateChange,
  onReportTypeChange,
  onSearchChange,
  isLoading,
}: ReportsCalendarViewPropsType) => {
  return (
    <div className={css.container}>
      <div className={css.calendarPane}>
        <ReportsCalendar
          selectedDate={selectedDate}
          onDateChange={onDateChange}
        />
      </div>
      <div className={css.timelinePane}>
        <ReportsTimeline
          data={{ users, counts }}
          filters={{ selectedReportType, search }}
          callbacks={{ onReportTypeChange, onSearchChange }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
