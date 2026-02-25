import type { ReportItemType, ReportSortFieldType } from "@/types/Report";
import SortArrows from "@/components/SortArrows";
import Loader from "@/components/Loader";
import ReportRow from "@/features/reports/components/ReportRow";
import css from "@/features/reports/index.module.css";

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
              reports.map((report) => (
                <ReportRow key={report.userId} report={report} />
              ))
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
