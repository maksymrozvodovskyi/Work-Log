import SearchInput from "@/components/SearchInput";
import css from "./UsersMultiSelectModal.module.css";

type SearchSectionProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export default function SearchSection({ searchTerm, onSearchChange }: SearchSectionProps) {
  return (
    <div className={css.searchSection}>
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search by name"
        ariaLabel="Search users"
      />
    </div>
  );
}