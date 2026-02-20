import { Link } from "react-router-dom";
import type { UserRangeType, HoursFilterType } from "@/types/User";
import type { UserStatusType } from "@/types/User";
import { userStatusMap } from "@/types/UserStatusMap";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import SortArrows from "@/components/SortArrows";
import css from "@/features/reports/index.module.css";

export type ReportsSortFieldType = "name" | "status" | "total";

type TableHeaderType = {
  label: string;
  field?: ReportsSortFieldType;
  sortable?: boolean;
};

type ReportsUserTablePropsType = {
  users: UserRangeType[];
  sortField: ReportsSortFieldType;
  sortDirection: "asc" | "desc" | null;
  onSort: (field: ReportsSortFieldType) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  disabled?: boolean;
  selectedTrackStatuses?: string[];
  selectedHours?: HoursFilterType | null;
};

const getProjectsDisplay = (user: UserRangeType): string => {
  const projects = [user.mainProject, ...user.otherProjects].filter(Boolean);

  return projects.join(", ") || "—";
};

const formatOvertime = (totalHours: number): string => {
  const OVERTIME_START = 8;

  if (totalHours <= OVERTIME_START) return "—";

  const overtimeMinutes = Math.round((totalHours - OVERTIME_START) * 60);

  const hours = Math.floor(overtimeMinutes / 60);

  const minutes = overtimeMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

const ReportsUserTable = ({
  users,
  sortField,
  sortDirection,
  onSort,
  isLoading = false,
  isFetching = false,
  disabled = false,
  selectedTrackStatuses = [],
  selectedHours = null,
}: ReportsUserTablePropsType) => {
  const hasData = users.length > 0;
  const showOverlayLoader = hasData && isFetching && !isLoading;

  const hasActiveFilters =
    selectedTrackStatuses.length > 0 || selectedHours !== null;

  const getTableHeaders = (): TableHeaderType[] => {
    const baseHeaders: TableHeaderType[] = [
      { label: "", sortable: false },
      { label: "Name", field: "name", sortable: true },
      { label: "Status", field: "status", sortable: true },
      { label: "Projects", sortable: false },
      { label: "Time", sortable: false },
      { label: "Total", field: "total", sortable: true },
    ];

    if (hasActiveFilters) {
      baseHeaders.push({ label: "Overtime", sortable: false });
    }

    return baseHeaders;
  };

  const tableHeaders = getTableHeaders();

  return (
    <div className={css.tableWrapper}>
      <div className={css.tableContainer}>
        <table className={css.table} aria-label="Reports users list">
          <colgroup>
            <col style={{ width: "60px" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "32%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "14%" }} />
            {hasActiveFilters && <col style={{ width: "12%" }} />}
          </colgroup>
          <thead className={css.tableHead}>
            <tr>
              {tableHeaders.map((header) => {
                if (header.sortable && header.field) {
                  return (
                    <th key={header.label} className={css.tableHeader}>
                      <button
                        className={css.sortableHeader}
                        onClick={() => onSort(header.field!)}
                        type="button"
                        disabled={disabled}
                      >
                        <div className={css.headerContent}>
                          {header.label}
                          <SortArrows
                            field={header.field}
                            currentSortField={sortField}
                            sortDirection={sortDirection}
                          />
                        </div>
                      </button>
                    </th>
                  );
                }
                return (
                  <th key={header.label} className={css.tableHeader}>
                    <div className={css.headerContent}>{header.label}</div>
                  </th>
                );
              })}
            </tr>
            <tr className={css.spacerRow}>
              <td colSpan={hasActiveFilters ? 7 : 6}></td>
            </tr>
          </thead>
          <tbody className={css.tableBody}>
            {isLoading && (
              <tr>
                <td
                  colSpan={hasActiveFilters ? 7 : 6}
                  className={css.loaderCell}
                >
                  <Loader size="medium" className={css.tableLoader} />
                </td>
              </tr>
            )}
            {!isLoading &&
              users.map((user) => {
                const statusInfo = userStatusMap[user.status as UserStatusType];
                return (
                  <tr key={user.id} className={css.tableRow}>
                    <td className={css.tableCell}>
                      <div className={css.avatarCell}>
                        <Avatar
                          name={user.name}
                          status={user.status}
                          showStatus={false}
                        />
                      </div>
                    </td>
                    <td className={`${css.tableCell} ${css.nameColumn}`}>
                      <Link
                        to={`/users/${user.id}`}
                        className={css.userNameLink}
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td className={css.tableCell}>
                      <span
                        className={css.statusTag}
                        style={{
                          color: statusInfo?.color ?? "#94a3b8",
                        }}
                      >
                        {statusInfo?.label ?? user.status}
                      </span>
                    </td>
                    <td className={css.tableCell}>
                      <span className={css.projectsCell}>
                        {getProjectsDisplay(user)}
                      </span>
                    </td>
                    <td className={css.tableCell}>
                      {user.totalHours != null
                        ? user.totalHours.toString()
                        : "—"}
                    </td>
                    <td className={css.tableCell}>
                      {user.totalHours != null
                        ? user.totalHours.toString()
                        : "—"}
                    </td>
                    {hasActiveFilters && (
                      <td className={css.tableCell}>
                        {user.totalHours != null
                          ? formatOvertime(user.totalHours)
                          : "—"}
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
        {showOverlayLoader && (
          <div className={css.tableOverlay}>
            <Loader size="medium" className={css.tableLoader} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsUserTable;
