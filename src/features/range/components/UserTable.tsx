import clsx from "clsx";
import type { UserRange, UserSortField, SortDirection } from "@/types/User";
import css from "@/features/range/index.module.css";
import SortArrows from "@/components/SortArrows";

interface TableHeader {
  label: string;
  field?: UserSortField;
  sortable?: boolean;
}

interface UserTableProps {
  users: UserRange[];
  sortField: UserSortField;
  sortDirection: SortDirection | null;
  onSort: (field: UserSortField) => void;
}

const tableHeaders: TableHeader[] = [
  { label: "Name", field: "name", sortable: true },
  { label: "Main project", sortable: false },
  { label: "Other projects", sortable: false },
];

const UserTable = ({
  users,
  sortField,
  sortDirection,
  onSort,
}: UserTableProps) => {
  return (
    <div className={css.tableWrapper}>
      <div className={css.tableHeaderContainer}>
        <table className={css.table} aria-label="Users list header">
          <thead className={css.tableHead}>
            <tr>
              {tableHeaders.map((header) => (
                <th key={header.label} className={css.tableHeader}>
                  {header.sortable && header.field ? (
                    <button
                      className={css.sortableHeader}
                      onClick={() => onSort(header.field!)}
                      type="button"
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
              <td colSpan={3}></td>
            </tr>
          </thead>
        </table>
      </div>
      <div className={css.tableContainer}>
        <table className={css.table} aria-label="Users list">
          <thead className={css.tableHeadHidden}>
            <tr>
              {tableHeaders.map((header) => (
                <th key={header.label} className={css.tableHeader}></th>
              ))}
            </tr>
            <tr className={css.spacerRow}>
              <td colSpan={3}></td>
            </tr>
          </thead>
          <tbody className={css.tableBody}>
            {users.map((user) => (
              <tr key={user.id} className={clsx(css.tableRow)}>
                <td className={css.tableCell}>
                  <div className={css.nameCell}>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td className={css.tableCell}>{user.mainProject || "—"}</td>
                <td className={css.tableCell}>
                  <div className={css.projectsCell}>
                    {user.otherProjects.length > 0 ? (
                      <>
                        {user.otherProjects.slice(0, 3).join(", ")}
                        {user.otherProjects.length > 3
                          ? `, +${user.otherProjects.length - 3} projects`
                          : ""}
                      </>
                    ) : (
                      "—"
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
