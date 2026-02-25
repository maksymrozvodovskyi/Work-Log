import css from "./SearchInput.module.css";
import SearchIcon from "@/components/svg/SearchIcon";
import CloseIcon from "@/components/svg/CloseIcon";

type SearchInputPropsType = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  variant?: "default" | "shortUnderscore";
};

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search by name, skills etc.",
  disabled = false,
  variant = "default",
}: SearchInputPropsType) => {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div
      className={
        variant === "shortUnderscore"
          ? `${css.searchInputWrapper} ${css.searchInputWrapperShortUnderscore}`
          : css.searchInputWrapper
      }
    >
      <SearchIcon />
      <input
        id="search-input"
        type="text"
        className={css.searchInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className={css.clearButton}
          disabled={disabled}
        >
          <CloseIcon fill="#AEB8C2" stroke="#AEB8C2" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
