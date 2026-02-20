import clsx from "clsx";
import type { ActivityType } from "@/types/WorkLog";
import type { HoursFilterType } from "@/types/User";
import { TRACK_STATUS_ORDER, trackStatusMap } from "@/features/reports/constants/trackStatusMap";
import ReportSelectIcon from "@/components/svg/ReportSelectIcon";
import css from "./ReportsFilterPanel.module.css";

const HOURS_OPTIONS: HoursFilterType[] = ["<8h", "8h", "8h>"];

type ReportsFilterPanelPropsType = {
  selectedTrackStatuses: ActivityType[];
  selectedHours: HoursFilterType | null;
  onTrackStatusToggle: (status: ActivityType) => void;
  onHoursToggle: (option: HoursFilterType) => void;
};

export default function ReportsFilterPanel({
  selectedTrackStatuses,
  selectedHours,
  onTrackStatusToggle,
  onHoursToggle,
}: ReportsFilterPanelPropsType) {

  return (
    <aside className={css.filterPanel} aria-label="Reports filters">
      <section className={css.trackStatusSection}>
        <h3 className={css.trackStatusHeader}>Track status</h3>
        <div className={css.trackStatusContent}>
          <div className={css.trackStatusGrid}>
            {TRACK_STATUS_ORDER.map((status) => {
              const info = trackStatusMap[status];
              const isSelected = selectedTrackStatuses.includes(status);
              return (
                <button
                  key={status}
                  type="button"
                  className={css.trackStatusOption}
                  onClick={() => onTrackStatusToggle(status)}
                  aria-pressed={isSelected}
                >
                  <ReportSelectIcon selected={isSelected} />
                  <span
                    className={css.trackStatusLabel}
                    style={{ color: info.color }}
                  >
                    {info.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={css.hoursSection}>
        <h3 className={css.hoursHeader}>Hours</h3>
        <div className={css.hoursContent}>
          <div className={css.hoursOptions}>
            {HOURS_OPTIONS.map((option) => {
            const isSelected = selectedHours === option;
            return (
              <button
                key={option}
                type="button"
                className={clsx(css.hoursOption, isSelected && css.hoursOptionSelected)}
                onClick={() => onHoursToggle(option)}
                aria-pressed={isSelected}
              >
                <ReportSelectIcon selected={isSelected} />
                <span className={css.hoursOptionLabel}>{option}</span>
              </button>
            );
          })}
          </div>
        </div>
      </section>
    </aside>
  );
}
