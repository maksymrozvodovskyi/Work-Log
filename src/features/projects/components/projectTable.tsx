import type {
  Project,
  SortField,
  SortDirection,
  ProjectStatus,
} from "../../../types/Project";
import { statusMap } from "../../../types/StatusMap";
import css from "../index.module.css";
import SortArrows from "@/components/SortArrows/SortArrows";
import StatusCircle from "../svg/StatusCircle";

const getStatusCircle = (status: ProjectStatus) => {
  const statusInfo = statusMap[status];
  return statusInfo ? <StatusCircle color={statusInfo.color} /> : null;
};

interface TableHeader {
  label: string;
  field?: SortField;
  sortable?: boolean;
}

const tableHeaders: TableHeader[] = [
  { label: "Status", field: "status", sortable: true },
  { label: "Name", field: "name", sortable: true },
  { label: "Description", sortable: false },
  { label: "Users", sortable: false },
  { label: "Created At", sortable: false },
  { label: "Actions", sortable: false },
];

interface ProjectTableProps {
  projects: Project[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEdit: (project: Project) => void;
}

const ProjectTable = ({
  projects,
  sortField,
  sortDirection,
  onSort,
  onEdit,
}: ProjectTableProps) => {
  return (
    <div className={css.tableWrapper}>
      <div className={css.tableContainer}>
        <table className={css.table} aria-label="Projects list">
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
