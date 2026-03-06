import SortArrows from "@/components/SortArrows";
import type { SortBy } from "@/api/vacations";

type Props = {
  label: string;
  field: SortBy;
  className: string;
  currentSortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: SortBy) => void;
};

export default function SortableHeader({
  label,
  field,
  className,
  currentSortField,
  sortDirection,
  onSort,
}: Props) {
  return (
    <button type="button" className={className} onClick={() => onSort(field)}>
      <span>{label}</span>
      <SortArrows
        field={field}
        currentSortField={currentSortField}
        sortDirection={sortDirection}
      />
    </button>
  );
}
