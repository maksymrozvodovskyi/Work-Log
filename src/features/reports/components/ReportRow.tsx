import { memo } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import type { ReportItemType } from "@/types/Report";
import { activityStatusMap } from "@/types/Report";
import Avatar from "@/components/Avatar";
import css from "@/features/reports/index.module.css";

const STATUS_COLOR_CLASSES = {
  CODING: css.statusColorCoding,
  REVIEW: css.statusColorReview,
  STUDING: css.statusColorStuding,
  SICKLEAVE: css.statusColorSickLeave,
  VACATION: css.statusColorVacation,
  WITHOUT_REPORT: css.statusColorWithoutReport,
} as const;

type ReportRowPropsType = {
  report: ReportItemType;
};

const ReportRow = memo(({ report }: ReportRowPropsType) => {
  const primaryStatus = report.statuses[0] || "WITHOUT_REPORT";
  const statusInfo = activityStatusMap[primaryStatus];
  const statusColorClass = STATUS_COLOR_CLASSES[primaryStatus];

  return (
    <tr className={css.tableRow}>
      <td className={css.tableCellFirst}>
        <div className={css.avatarCell}>
          <Avatar name={report.name} showStatus={false} size="small" />
          <Link to={`/users/${report.userId}`} className={css.userNameLink}>
            {report.name}
          </Link>
        </div>
      </td>
      <td className={css.tableCell}>
        <span
          className={clsx(
            primaryStatus === "WITHOUT_REPORT" && css.statusNoReport,
            primaryStatus !== "WITHOUT_REPORT" && css.statusBadge,
            statusColorClass,
          )}
        >
          {statusInfo?.label ?? primaryStatus}
        </span>
      </td>
      <td className={css.tableCell}>
        <div className={css.projectsCell}>
          {report.projects.length > 0 ? report.projects.join(", ") : null}
        </div>
      </td>
      <td className={css.tableCell}>
        {report.totalMinutes > 0 ? report.total : null}
      </td>
    </tr>
  );
});

export default ReportRow;
