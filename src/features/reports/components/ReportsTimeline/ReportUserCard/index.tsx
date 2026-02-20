import { Link } from "react-router-dom";
import clsx from "clsx";
import Avatar from "@/components/Avatar";
import type { UserRangeType } from "@/types/User";
import type { ReportType } from "@/api/reports";
import type { ReportCardStatusKey } from "@/utils/reportsTimelineUtils";
import {
  getRoleOrSkill,
  formatWorkDetails,
  formatVacationDateRange,
  getCardStatus,
} from "@/utils/reportsTimelineUtils";
import css from "../ReportsTimeline.module.css";

const STATUS_CLASS_MAP: Record<ReportCardStatusKey, string> = {
  work: css.cardStatusWork,
  vacation: css.cardStatusVacation,
  sickleave: css.cardStatusSickLeave,
  special: css.cardStatusSpecial,
};

type ReportUserCardPropsType = {
  user: UserRangeType;
  reportType: ReportType;
};

const isWorkOrOvertime = (type: ReportType) =>
  type === "work" || type === "overtime";

const isVacationSpecial = (user: UserRangeType, reportType: ReportType) =>
  reportType === "special" &&
  user.specialType === "VACATION" &&
  user.vacationPeriod;

export const ReportUserCard = ({
  user,
  reportType,
}: ReportUserCardPropsType) => {
  const { label, statusKey } = getCardStatus(user, reportType);

  const statusClassName = statusKey ? STATUS_CLASS_MAP[statusKey] : undefined;

  const showWorkDetails = isWorkOrOvertime(reportType);

  const showVacation = isVacationSpecial(user, reportType);

  return (
    <article
      className={clsx(
        css.card,
        showWorkDetails && css.cardWork,
        showVacation && css.cardSpecial,
      )}
    >
      <span className={clsx(css.cardStatus, statusClassName)}>{label}</span>
      <div className={css.cardContent}>
        <Avatar name={user.name} status={user.status} showStatus={false} />
        <div className={css.cardInfo}>
          <Link to={`/users/${user.id}`} className={css.cardName}>
            {user.name}
          </Link>
          <span className={css.cardRole}>{getRoleOrSkill(user)}</span>
        </div>
      </div>
      {showWorkDetails && (
        <>
          <div className={css.cardSeparator} aria-hidden="true" />
          <span className={css.cardDetails}>{formatWorkDetails(user)}</span>
        </>
      )}
      {showVacation && user.vacationPeriod && (
        <>
          <div className={css.cardSeparator} aria-hidden="true" />
          <span className={css.cardVacationDays}>
            {user.vacationPeriod.days} d
          </span>
          <span className={css.cardVacationDateRange}>
            {formatVacationDateRange(
              user.vacationPeriod.startDate,
              user.vacationPeriod.endDate,
            )}
          </span>
        </>
      )}
    </article>
  );
};
