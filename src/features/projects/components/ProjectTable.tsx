import type {
  ProjectType,
  SortFieldType,
  SortDirectionType,
  ProjectStatusType,
} from "@/types/Project";
import { statusMap } from "@/types/StatusMap";
import css from "@/features/projects/index.module.css";
import SortArrows from "@/components/SortArrows";
import StatusCircle from "@/components/svg/StatusCircle";
import Loader from "@/components/Loader";

type TableHeaderType = {
  label: string;
  field?: SortFieldType;
  sortable?: boolean;
};

type ProjectTablePropsType = {
  projects: ProjectType[];
  sortField: SortFieldType;
  sortDirection: SortDirectionType;
  onSort: (field: SortFieldType) => void;
  onEdit: (project: ProjectType) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  disabled?: boolean;
};

const getStatusCircle = (status: ProjectStatusType) => {
  const statusInfo = statusMap[status];
  return statusInfo ? <StatusCircle color={statusInfo.color} /> : null;
};

const tableHeaders: TableHeaderType[] = [
  { label: "Status", field: "status", sortable: true },
  { label: "Name", field: "name", sortable: true },
  { label: "Description", sortable: false },
  { label: "Users", sortable: false },
  { label: "Created At", sortable: false },
  { label: "Actions", sortable: false },
];

const ProjectTable = ({
  projects,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  isLoading = false,
  isFetching = false,
  disabled = false,
}: ProjectTablePropsType) => {
  const hasData = projects.length > 0;
  const showOverlayLoader = hasData && isFetching && !isLoading;

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
              <td colSpan={6}></td>
            </tr>
          </thead>
          <tbody className={css.tableBody}>
            {isLoading ? (
              <tr>
                <td colSpan={6} className={css.loaderCell}>
                  <Loader size="medium" className={css.tableLoader} />
                </td>
              </tr>
            ) : (
              <>
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
                        ? project.users.length > 2
                          ? `${project.users
                              .slice(0, 2)
                              .map((user) => user.name)
                              .join(", ")}, +${project.users.length - 2}`
                          : project.users.map((user) => user.name).join(", ")
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
                        disabled={disabled}
                      >
                        Edit
                      </button>
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

export default ProjectTable;
