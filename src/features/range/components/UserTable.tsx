import { Link } from "react-router-dom";
import type {
  UserRangeType,
  UserSortFieldType,
  SortDirectionType,
} from "@/types/User";
import css from "@/features/range/index.module.css";
import SortArrows from "@/components/SortArrows";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";

type TableHeaderType = {
  label: string;
  field?: UserSortFieldType;
  sortable?: boolean;
};

type UserTablePropsType = {
  users: UserRangeType[];
  sortField: UserSortFieldType;
  sortDirection: SortDirectionType | null;
  onSort: (field: UserSortFieldType) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  disabled?: boolean;
};

const tableHeaders: TableHeaderType[] = [
  { label: "Status", field: "status", sortable: true },
  { label: "Name", field: "name", sortable: true },
  { label: "Main project", sortable: false },
  { label: "Other projects", sortable: false },
];

const UserTable = ({
  users,
  sortField,
  sortDirection,
  onSort,
  isLoading = false,
  isFetching = false,
  disabled = false,
}: UserTablePropsType) => {
  const hasData = users.length > 0;
  const showOverlayLoader = hasData && isFetching && !isLoading;

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
        <table className={css.table} aria-label="Users list">
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
            {isLoading ? (
              <tr>
                <td colSpan={4} className={css.loaderCell}>
                  <Loader size="medium" className={css.tableLoader} />
                </td>
              </tr>
            ) : (
              <>
                {users.map((user) => (
                  <tr key={user.id} className={css.tableRow}>
                    <td className={css.tableCell}>
                      <div className={css.avatarCell}>
                        <Avatar
                          name={user.name}
                          status={user.status}
                          showStatus={true}
                        />
                      </div>
                    </td>
                    <td className={css.tableCell}>
                      <Link
                        to={`/users/${user.id}`}
                        className={css.userNameLink}
                      >
                        {user.name}
                      </Link>
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
              </>
            )}
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

export default UserTable;
