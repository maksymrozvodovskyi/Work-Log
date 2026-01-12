import clsx from "clsx";
import type { UserRange, UserSortField, SortDirection } from "@/types/User";
import css from "@/features/range/index.module.css";
import SortArrows from "@/components/SortArrows/SortArrows";

interface TableHeader {
  label: string;
  field?: UserSortField;
  sortable?: boolean;
}

const tableHeaders: TableHeader[] = [
  { label: "Name", field: "name", sortable: true },
  { label: "Managers", sortable: false },
  { label: "Main project", sortable: false },
  { label: "Other projects", sortable: false },
];

interface UserTableProps {
  users: UserRange[];
  sortField: UserSortField;
  sortDirection: SortDirection;
  onSort: (field: UserSortField) => void;
  onEdit: (user: UserRange) => void;
}

const UserAvatar = ({ color, name }: { color?: string; name: string }) => {
  const avatarColor = color || "#94a3b8";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={css.userAvatar}
      style={{ backgroundColor: avatarColor }}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
};

const UserTable = ({
  users,
  sortField,
  sortDirection,
  onSort,
  onEdit,
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
            {users.map((user) => (
              <tr
                key={user.id}
                className={clsx(css.tableRow)}
                onDoubleClick={() => onEdit(user)}
              >
                <td className={css.tableCell}>
                  <div className={css.nameCell}>
                    <UserAvatar color={user.avatar} name={user.name} />
                    <span>{user.name}</span>
                  </div>
                </td>
                <td className={css.tableCell}>
                  <div className={css.managersCell}>
                    {user.managers.length > 0
                      ? user.managers
                          .map((m) => `${m.name} ${m.date}`)
                          .join(", ")
                      : "—"}
                  </div>
                </td>
                <td className={css.tableCell}>{user.mainProject || "—"}</td>
                <td className={css.tableCell}>
                  <div className={css.projectsCell}>
                    {user.otherProjects.length > 0
                      ? `${user.otherProjects[0]}${
                          user.otherProjects.length > 1
                            ? `, +${user.otherProjects.length - 1} projects`
                            : ""
                        }`
                      : "—"}
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
