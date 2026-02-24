import type { ActivityType, HoursFilterType } from "@/types/Report";
import {
  SCHEMA_ACTIVITY_ORDER,
  HOURS_OPTIONS,
} from "@/features/reports/constants";
import ActivityFilterButton from "@/components/ActivityFilterButton";
import HoursFilterButton from "@/components/HoursFilterButton";
import css from "@/features/reports/index.module.css";

type ReportsFilterPanelPropsType = {
  disabled?: boolean;
  activities: ActivityType[];
  hours: HoursFilterType[];
  onFiltersChange: (filters: {
    activities: ActivityType[];
    hours: HoursFilterType[];
  }) => void;
};

const ReportsFilterPanel = ({
  disabled = false,
  activities,
  hours,
  onFiltersChange,
}: ReportsFilterPanelPropsType) => {
  const handleActivityToggle = (activity: ActivityType) => {
    if (disabled) return;

    const newActivities = activities.includes(activity)
      ? activities.filter((a) => a !== activity)
      : [...activities, activity];

    onFiltersChange({
      activities: newActivities,
      hours,
    });
  };

  const handleHoursToggle = (value: HoursFilterType) => {
    if (disabled) return;

    const newHours = hours.includes(value)
      ? hours.filter((h) => h !== value)
      : [...hours, value];

    onFiltersChange({
      activities,
      hours: newHours,
    });
  };

  return (
    <div className={css.filterSidebar}>
      <div className={css.filterTrackStatusDiv}>
        <div className={css.filterPanelHeader}>
          <span className={css.filterPanelHeaderTitle}>Track status</span>
        </div>
        <div className={css.filterPanelTrackStatusContent}>
          <div className={css.activityFilterList}>
            {SCHEMA_ACTIVITY_ORDER.map((activity) => {
              const selected = activities.includes(activity);

              return (
                <ActivityFilterButton
                  key={activity}
                  disabled={disabled}
                  selected={selected}
                  onClick={() => handleActivityToggle(activity)}
                  activity={activity}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className={css.filterHoursDiv}>
        <div className={css.filterHoursHeader}>
          <span className={css.filterPanelHeaderTitle}>Hours</span>
        </div>
        <div className={css.filterPanelHoursContent}>
          <div className={css.hoursFilterList}>
            {HOURS_OPTIONS.map((option) => (
              <HoursFilterButton
                key={option.value}
                disabled={disabled}
                selected={hours.includes(option.value)}
                onClick={() => handleHoursToggle(option.value)}
                label={option.label}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsFilterPanel;
