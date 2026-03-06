import { flexRender, type Row as TanStackRow } from "@tanstack/react-table";
import clsx from "clsx";
import css from "./index.module.css";
import type { VacationRow } from "./index";

type Props = {
  row: TanStackRow<VacationRow>;
  isActive: boolean;
  onRowClick: () => void;
};

export default function TableRow({ row, isActive, onRowClick }: Props) {
  return (
    <tr
      className={clsx(css.tr, isActive && css.activeRow)}
      onClick={onRowClick}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className={css.td}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}
