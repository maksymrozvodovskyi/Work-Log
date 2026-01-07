import type { Project, SortField, SortDirection } from "../../../types/project";
import css from "../index.module.css";

interface ProjectTableProps {
  projects: Project[];
  isError: boolean;
  error: Error | null;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const ProjectTable = ({
  projects,
  isError,
  error,
  sortField,
  sortDirection,
  onSort,
}: ProjectTableProps) => {
  if (isError) {
    return <div>{error?.message}</div>;
  }

  return (
    <div className={css.tableWrapper}>
      <div className={css.tableHeaderContainer}>
        <table className={css.table} aria-label="Projects list header">
          <thead className={css.tableHead}>
            <tr>
              <th className={css.tableHeader}>
                <button
                  className={css.sortableHeader}
                  onClick={() => onSort("status")}
                  type="button"
                >
                  <div className={css.headerContent}>
                    Status
                    <div className={css.arrowsContainer}>
                      <svg
                        width="4"
                        height="3"
                        viewBox="0 0 4 3"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${css.headerArrow} ${
                          sortField === "status" && sortDirection === "asc"
                            ? css.active
                            : ""
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 3L2 0L4 3H0Z"
                          fill={
                            sortField === "status" && sortDirection === "asc"
                              ? "#6b7682"
                              : "#aeb8c2"
                          }
                        />
                      </svg>
                      <svg
                        width="4"
                        height="3"
                        viewBox="0 0 4 3"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${css.headerArrow} ${
                          sortField === "status" && sortDirection === "desc"
                            ? css.active
                            : ""
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 0L2 3L4 0H0Z"
                          fill={
                            sortField === "status" && sortDirection === "desc"
                              ? "#6b7682"
                              : "#aeb8c2"
                          }
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </th>
              <th className={css.tableHeader}>
                <button
                  className={css.sortableHeader}
                  onClick={() => onSort("name")}
                  type="button"
                >
                  <div className={css.headerContent}>
                    Name
                    <div className={css.arrowsContainer}>
                      <svg
                        width="4"
                        height="3"
                        viewBox="0 0 4 3"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${css.headerArrow} ${
                          sortField === "name" && sortDirection === "asc"
                            ? css.active
                            : ""
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 3L2 0L4 3H0Z"
                          fill={
                            sortField === "name" && sortDirection === "asc"
                              ? "#6b7682"
                              : "#aeb8c2"
                          }
                        />
                      </svg>
                      <svg
                        width="4"
                        height="3"
                        viewBox="0 0 4 3"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${css.headerArrow} ${
                          sortField === "name" && sortDirection === "desc"
                            ? css.active
                            : ""
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0 0L2 3L4 0H0Z"
                          fill={
                            sortField === "name" && sortDirection === "desc"
                              ? "#6b7682"
                              : "#aeb8c2"
                          }
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </th>
              <th className={css.tableHeader}>
                <div className={css.headerContent}>Description</div>
              </th>
              <th className={css.tableHeader}>
                <div className={css.headerContent}>Users</div>
              </th>
              <th className={css.tableHeader}>
                <div className={css.headerContent}>Created At</div>
              </th>
            </tr>
            <tr className={css.spacerRow}>
              <td colSpan={5}></td>
            </tr>
          </thead>
        </table>
      </div>
      <div className={css.tableContainer}>
        <table className={css.table} aria-label="Projects list">
          <thead className={css.tableHeadHidden}>
            <tr>
              <th className={css.tableHeader}></th>
              <th className={css.tableHeader}></th>
              <th className={css.tableHeader}></th>
              <th className={css.tableHeader}></th>
              <th className={css.tableHeader}></th>
            </tr>
            <tr className={css.spacerRow}>
              <td colSpan={5}></td>
            </tr>
          </thead>
          <tbody className={css.tableBody}>
            {projects.map((project) => (
              <tr key={project.id} className={css.tableRow}>
                <td className={css.tableCell}>
                  <div className={css.statusCell}>
                    {project.status === "INPROGRESS" && (
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="14" cy="14" r="14" fill="#0BAF6D" />
                      </svg>
                    )}
                    {project.status === "COMPLETED" && (
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="14" cy="14" r="14" fill="#f59e0b" />
                      </svg>
                    )}
                    {project.status === "PENDING" && (
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="14" cy="14" r="14" fill="#ec4899" />
                      </svg>
                    )}
                  </div>
                </td>
                <td className={css.tableCell}>{project.name}</td>
                <td className={css.tableCell}>
                  <div className={css.descriptionCell}>
                    {project.description || "—"}
                  </div>
                </td>
                <td className={css.tableCell}>
                  {project.users.length > 0
                    ? project.users.map((user) => user.name).join(", ")
                    : "—"}
                </td>
                <td className={css.tableCell}>
                  {new Date(project.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
