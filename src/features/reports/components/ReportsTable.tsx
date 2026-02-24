import { Link } from "react-router-dom";
import type { ReportItemType, ReportSortFieldType } from "@/types/Report";
import { activityStatusMap } from "@/types/Report";
import SortArrows from "@/components/SortArrows";
import Loader from "@/components/Loader";
import css from "@/features/reports/index.module.css";
import Avatar from "@/components/Avatar";

type TableHeaderType =
  | { label: string; sortable: true; field: ReportSortFieldType }
  | { label: string; sortable: false };

type ReportsTablePropsType = {
  reports: ReportItemType[];
  sort: {
    field: ReportSortFieldType;
    direction: "asc" | "desc";
    onSort: (field: ReportSortFieldType) => void;
  };
  loading: {
    isLoading: boolean;
    isFetching: boolean;
  };
};

const tableHeaders: TableHeaderType[] = [
  { label: "Name", sortable: true, field: "name" },
  { label: "Status", sortable: true, field: "status" },
  { label: "Projects", sortable: false },
  { label: "Total", sortable: true, field: "totalMinutes" },
];

const ReportsTable = ({
  reports,
  sort,
  loading = { isLoading: false, isFetching: false },
}: ReportsTablePropsType) => {
  const { field: sortField, direction: sortDirection, onSort } = sort;
  const { isLoading, isFetching } = loading;

  const disabled = isFetching;

  const renderReportRow = (report: ReportItemType) => {
    const statusInfo = activityStatusMap[report.status];

    return (
      <tr key={report.userId} className={css.tableRow}>
        <td className={css.tableCellFirst}>
          <div className={css.avatarCell}>
            <Avatar name={report.name} showStatus={false} size={28} />
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
  };

  return (
    <div className={css.tableWrapper}>
      <div className={css.tableHeaderContainer}>
        <table className={css.table}>
          <thead className={css.tableHead}>
            <tr>
              {tableHeaders.map((header) => (
                <th key={header.label} className={css.tableHeader}>
                  {header.sortable ? (
                    <button
                      type="button"
                      className={css.sortableHeader}
                      onClick={() => onSort(header.field)}
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
                  ) : (
                    <div className={css.headerContent}>{header.label}</div>
                  )}
                </th>
              ))}
            </tr>
            <tr className={css.spacerRow}>
              <td colSpan={4}></td>
            </tr>
          </thead>
        </table>
      </div>
      <div className={css.tableContainer}>
        <table className={css.table}>
          <thead className={css.tableHeadHidden}>
            <tr>
              {tableHeaders.map((header) => (
                <th key={header.label} className={css.tableHeader}></th>
              ))}
            </tr>
            <tr className={css.spacerRow}>
              <td colSpan={4}></td>
            </tr>
          </thead>
          <tbody className={css.tableBody}>
            {reports.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={4} className={css.emptyState}>
                  No reports found
                </td>
              </tr>
            ) : (
              reports.map(renderReportRow)
            )}
          </tbody>
        </table>
        {isFetching && !isLoading && (
          <div className={css.tableOverlay}>
            <Loader size="medium" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsTable;
