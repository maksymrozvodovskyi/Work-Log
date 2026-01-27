import css from "./SearchInput.module.css";
import SearchIcon from "@/components/svg/SearchIcon";
import CloseIcon from "@/components/svg/CloseIcon";

type SearchInputPropsType = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search by name, skills etc.",
  ariaLabel = "Search projects by name, skills etc.",
  disabled = false,
}: SearchInputPropsType) => {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className={css.searchInputWrapper}>
      <SearchIcon />
      <input
        id="search-input"
        type="text"
        className={css.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className={css.clearButton}
          aria-label="Clear search"
          disabled={disabled}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

