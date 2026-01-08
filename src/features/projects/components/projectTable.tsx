import type {
  Project,
  SortField,
  SortDirection,
  ProjectStatus,
} from "../../../types/project";
import { statusMap } from "../../../types/statusMap";
import css from "../index.module.css";
import SortArrowUp from "../svg/SortArrowUp";
import SortArrowDown from "../svg/SortArrowDown";
import StatusCircle from "../svg/StatusCircle";

const getStatusCircle = (status: ProjectStatus) => {
  const statusInfo = statusMap[status];
  return statusInfo ? <StatusCircle color={statusInfo.color} /> : null;
};

interface ProjectTableProps {
  projects: Project[];
  isError: boolean;
  error: Error | null;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEdit: (project: Project) => void;
}

const ProjectTable = ({
  projects,
  isError,
  error,
  sortField,
  sortDirection,
  onSort,
  onEdit,
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
                      <SortArrowUp
                        className={`${css.headerArrow} ${
                          sortField === "status" && sortDirection === "asc"
                            ? css.active
                            : ""
                        }`}
                        fill={
                          sortField === "status" && sortDirection === "asc"
                            ? "#6b7682"
                            : "#aeb8c2"
                        }
                      />
                      <SortArrowDown
                        className={`${css.headerArrow} ${
                          sortField === "status" && sortDirection === "desc"
                            ? css.active
                            : ""
                        }`}
                        fill={
                          sortField === "status" && sortDirection === "desc"
                            ? "#6b7682"
                            : "#aeb8c2"
                        }
                      />
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
                      <SortArrowUp
                        className={`${css.headerArrow} ${
                          sortField === "name" && sortDirection === "asc"
                            ? css.active
                            : ""
                        }`}
                        fill={
                          sortField === "name" && sortDirection === "asc"
                            ? "#6b7682"
                            : "#aeb8c2"
                        }
                      />
                      <SortArrowDown
                        className={`${css.headerArrow} ${
                          sortField === "name" && sortDirection === "desc"
                            ? css.active
                            : ""
                        }`}
                        fill={
                          sortField === "name" && sortDirection === "desc"
                            ? "#6b7682"
                            : "#aeb8c2"
                        }
                      />
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
              <th className={css.tableHeader}>
                <div className={css.headerContent}>Actions</div>
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
                    {getStatusCircle(project.status)}
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
                <td className={css.tableCell}>
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className={css.editButton}
                  >
                    Edit
                  </button>
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
