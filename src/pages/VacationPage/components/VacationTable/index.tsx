import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import css from "./index.module.css";
import { format } from "date-fns";
import type { VacationUser, SortBy } from "@/api/vacations";
import Avatar from "@/components/Avatar";
import { useMemo, useState } from "react";
import { buildYears } from "@/features/vacations/utils/buildYears";
import { countUsedByYear } from "@/features/vacations/utils/countUsedByYear";
import { formatYearLabel } from "@/features/vacations/utils/formatYearLabel";
import { ALLOWANCE_PER_YEAR } from "@/features/vacations/constants";
import YearCellView from "@/pages/VacationPage/components/YearCellView";
import type { YearCell } from "@/features/vacations/types";
import TableRow from "./TableRow";
import VacationDetailsModal from "../VacationDetailsModal";
import type { VacationDetailsModalData } from "@/features/vacations/types";
import SortableHeader from "../SortableHeader";
import VacationCommentsModal from "@/pages/VacationPage/components/VacationCommentsModal";

type CommentsModalData = {
  userId: string;
  userName: string;
};

export type VacationRow = {
  id: string;
  name: string;
  role: string;
  status: VacationUser["status"];
  workStart: string;
  years: YearCell[];
  comments: string;
};

type Props = {
  users: VacationUser[];
  isLoading?: boolean;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: SortBy) => void;
};

export default function VacationsTable({
  users,
  sortField,
  sortDirection,
  onSort,
}: Props) {
  const [modalData, setModalData] = useState<VacationDetailsModalData | null>(
    null,
  );

  const [commentsModalData, setCommentsModalData] =
    useState<CommentsModalData | null>(null);

  const selectedUserId = modalData?.userId ?? commentsModalData?.userId ?? null;

  const years = useMemo(() => buildYears(new Date()), []);

  const data = useMemo<VacationRow[]>(() => {
    return users.map((u) => {
      const usedByYear = countUsedByYear(u.workLogs);

      const yearsCells: YearCell[] = [];

      for (const y of years) {
        const usedDays = usedByYear[y] ?? 0;

        const remaining = ALLOWANCE_PER_YEAR - usedDays;
        const remainingDays = remaining > 0 ? remaining : 0;

        yearsCells.push({
          label: formatYearLabel(y),
          usedDays,
          remainingDays,
        });
      }

      return {
        id: u.id,
        name: u.name,
        role: u.role,
        status: u.status,
        workStart: format(new Date(u.createdAt), "dd.MM.yyyy"),
        years: yearsCells,
        comments: u.lastComment?.content ?? "",
      };
    });
  }, [users, years]);

  const yearColumns = useMemo<ColumnDef<VacationRow>[]>(() => {
    return years.map((y, index) => ({
      id: `years-${y}`,
      header: formatYearLabel(y),
      cell: ({ row }) => <YearCellView {...row.original.years[index]} />,
    }));
  }, [years]);

  const openModalForRow = (row: VacationRow) => {
    const reversedYears = [...row.years].reverse();

    setModalData({
      userId: row.id,
      userName: row.name,
      years: reversedYears,
      workStart: { date: row.workStart },
      usedDays: reversedYears[0]?.usedDays ?? 0,
      remainingDays: reversedYears[0]?.remainingDays ?? 0,
    });
  };

  const columns = useMemo<ColumnDef<VacationRow>[]>(
    () => [
      {
        id: "spacer",
        header: () => null,
        cell: ({ row }) => (
          <Avatar
            name={row.original.name}
            status={row.original.status}
            showStatus
            size="small"
          />
        ),
      },
      {
        accessorKey: "name",
        header: () => (
          <SortableHeader
            label="Name"
            field="name"
            className={css.thInnerLeft}
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
        ),
        cell: ({ row }) => (
          <span className={css.nameCell}>{row.original.name}</span>
        ),
      },
      {
        accessorKey: "role",
        header: () => (
          <SortableHeader
            label="Role"
            field="role"
            className={css.thInnerCenter}
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
        ),
        cell: ({ row }) => (
          <span className={css.roleCell}>{row.original.role}</span>
        ),
      },
      {
        accessorKey: "workStart",
        header: () => (
          <SortableHeader
            label="Work start"
            field="createdAt"
            className={css.thInnerCenter}
            currentSortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
        ),
        cell: ({ row }) => (
          <div className={css.workStartDate}>{row.original.workStart}</div>
        ),
      },

      ...yearColumns,

      {
        accessorKey: "comments",
        header: "Comments",
        cell: ({ row }) => (
          <button
            type="button"
            className={css.commentBtn}
            onClick={(e) => {
              e.stopPropagation();

              setCommentsModalData({
                userId: row.original.id,
                userName: row.original.name,
              });
            }}
          >
            <div className={css.commentText}>{row.original.comments}</div>
          </button>
        ),
      },
    ],
    [onSort, sortField, sortDirection, yearColumns],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const isAnyModalOpen = Boolean(modalData || commentsModalData);

  return (
    <div className={css.wrapper}>
      {isAnyModalOpen && (
        <div
          className={css.modalOverlay}
          onClick={() => {
            setModalData(null);
            setCommentsModalData(null);
          }}
          aria-hidden="true"
        />
      )}

      <div className={css.tableContainer}>
        <table className={css.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={css.th}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            <tr className={css.spacerRow}>
              <td colSpan={columns.length} />
            </tr>

            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                row={row}
                isActive={row.original.id === selectedUserId}
                onRowClick={() => openModalForRow(row.original)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {modalData && (
        <VacationDetailsModal
          data={modalData}
          onClose={() => setModalData(null)}
        />
      )}

      {commentsModalData && (
        <VacationCommentsModal
          userId={commentsModalData.userId}
          userName={commentsModalData.userName}
          onClose={() => setCommentsModalData(null)}
        />
      )}
    </div>
  );
}
