import { Link } from "react-router-dom";
import clsx from "clsx";
import type { ReportItemType } from "@/types/Report";
import { activityStatusMap } from "@/types/Report";
import Avatar from "@/components/Avatar";
import css from "./ReportCard.module.css";

type ReportCardPropsType = {
  report: ReportItemType;
  variant?: "default" | "project" | "special";
};

const VARIANT_STYLES = {
  default: {
    card: css.reportCard,
    status: css.reportCardStatus,
  },
  project: {
    card: css.reportCardProject,
    status: css.reportCardStatusProject,
  },
  special: {
    card: css.reportCardSpecial,
    status: css.reportCardStatusSpecial,
  },
} as const;

const STATUS_COLOR_CLASSES = {
  CODING: css.statusColorCoding,
  REVIEW: css.statusColorReview,
  STUDING: css.statusColorStuding,
  SICKLEAVE: css.statusColorSickLeave,
  VACATION: css.statusColorVacation,
  WITHOUT_REPORT: css.statusColorWithoutReport,
} as const;

const ReportCard = ({ report, variant = "default" }: ReportCardPropsType) => {
  const styles = VARIANT_STYLES[variant];

  const primaryStatus = report.statuses[0] ?? "WITHOUT_REPORT";
  const statusInfo = activityStatusMap[primaryStatus];

  const statusLabel =
    variant === "project"
      ? "Work on project"
      : (statusInfo?.label ?? primaryStatus);

  const statusColorClass =
    variant === "special" ? STATUS_COLOR_CLASSES[primaryStatus] : null;

  const showBottom = variant === "project";
  const showProjects = showBottom && report.projects.length > 0;
  const showHours = showBottom && Boolean(report.total);

  return (
    <div className={styles.card}>
      <span className={clsx(styles.status, statusColorClass)}>
        {statusLabel}
      </span>

      <div className={css.reportCardUser}>
        <Avatar name={report.name} showStatus={false} size="small" />
        <Link to={`/users/${report.userId}`} className={css.reportCardName}>
          {report.name}
        </Link>
      </div>

      {showBottom && (
        <>
          <div className={css.reportCardDivider} />
          <div className={css.reportCardProjects}>
            {showProjects &&
              report.projects.map((project, i, arr) => (
                <span
                  key={`${project}-${i}`}
                  className={css.reportCardProjectItem}
                >
                  {project}
                  {i < arr.length - 1 && ", "}
                </span>
              ))}

            {showHours && (
              <span className={css.reportCardProjectHours}>{report.total}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportCard;
