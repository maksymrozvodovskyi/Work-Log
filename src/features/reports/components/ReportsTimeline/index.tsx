import type { ReactNode } from "react";
import clsx from "clsx";
import SearchInput from "@/components/SearchInput";
import Loader from "@/components/Loader";
import type { UserRangeType } from "@/types/User";
import type { ReportType } from "@/api/reports";
import type { ReportsCountsType } from "@/api/reports";
import { REPORT_LABELS, REPORT_TYPES } from "@/utils/reportsTimelineUtils";
import { ReportUserCard } from "./ReportUserCard";
import css from "./ReportsTimeline.module.css";

type ReportsTimelinePropsType = {
  data: {
    users: UserRangeType[];
    counts: ReportsCountsType;
  };
  filters: {
    selectedReportType: ReportType | null;
    search: string;
  };
  callbacks: {
    onReportTypeChange: (type: ReportType | null) => void;
    onSearchChange: (value: string) => void;
  };
  isLoading: boolean;
  headerActions?: ReactNode;
};

export const ReportsTimeline = ({
  data: { users, counts },
  filters: { selectedReportType, search },
  callbacks: { onReportTypeChange, onSearchChange },
  isLoading,
  headerActions,
}: ReportsTimelinePropsType) => {
  const effectiveType = selectedReportType ?? "missed";

  return (
    <section className={css.timelineSection} aria-labelledby="report-timeline">
      <div className={css.timelineHeaderRow}>
        <h2 id="report-timeline" className={css.timelineHeader}>
          Report Timeline
        </h2>
        {headerActions && (
          <div className={css.timelineHeaderActions}>{headerActions}</div>
        )}
      </div>

      <div className={css.filtersRow}>
        {REPORT_TYPES.map((type) => {
          const count = counts[type];
          const isActive = effectiveType === type;
          return (
            <button
              key={type}
              type="button"
              className={clsx(css.pill, isActive && css.pillActive)}
              onClick={() => onReportTypeChange(isActive ? null : type)}
              aria-pressed={isActive}
            >
              {REPORT_LABELS[type]} {count}
            </button>
          );
        })}
        <div className={css.searchWrapper}>
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search by name or tech"
          />
        </div>
      </div>

      <div className={css.dashedLine} aria-hidden="true" />

      <div className={clsx(css.cardsGrid, isLoading && css.cardsGridCentered)}>
        {isLoading && (
          <div className={css.loaderWrapper}>
            <Loader size="medium" inline />
          </div>
        )}
        {!isLoading &&
          users.map((user) => (
            <ReportUserCard
              key={user.id}
              user={user}
              reportType={effectiveType}
            />
          ))}
      </div>
    </section>
  );
};
