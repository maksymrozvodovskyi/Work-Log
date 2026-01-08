import css from "../index.module.css";
import SearchIcon from "../svg/SearchIcon";
import CloseIcon from "../svg/CloseIcon";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search by name, skills etc.",
  ariaLabel = "Search projects by name, skills etc.",
}: SearchInputProps) => {
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
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={css.clearButton}
          aria-label="Clear search"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
