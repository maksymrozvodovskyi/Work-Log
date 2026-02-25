import { memo } from "react";
import { Link } from "react-router-dom";
import type { ReportItemType } from "@/types/Report";
import { activityStatusMap } from "@/types/Report";
import Avatar from "@/components/Avatar";
import css from "@/features/reports/index.module.css";

type ReportRowPropsType = {
  report: ReportItemType;
};

const ReportRow = memo(({ report }: ReportRowPropsType) => {
  const statusInfo = activityStatusMap[report.status];

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
          className={
            report.status === "WITHOUT_REPORT"
              ? css.statusNoReport
              : css.statusBadge
          }
          style={
            report.status !== "WITHOUT_REPORT"
              ? { color: statusInfo?.color ?? "#94a3b8" }
              : undefined
          }
        >
          {statusInfo?.label ?? report.status}
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
