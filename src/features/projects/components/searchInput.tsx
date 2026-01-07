import css from "../index.module.css";

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
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.8629 11.6364L15.7345 14.4865C16.0885 14.8403 16.0885 15.4103 15.7345 15.7445C15.5575 15.9017 15.3411 16 15.1051 16C14.8691 16 14.6527 15.9214 14.4757 15.7445L11.6238 12.855C10.3651 13.8575 8.79164 14.3882 7.19852 14.3882C5.27105 14.3882 3.46159 13.6413 2.10449 12.285C0.747388 10.9287 0 9.12039 0 7.1941C0 5.26781 0.747388 3.45946 2.10449 2.10319C3.46159 0.746929 5.27105 0 7.19852 0C9.126 0 10.9355 0.746929 12.2926 2.10319C14.8691 4.67813 15.1051 8.76659 12.8629 11.6364ZM11.0338 11.027C12.0565 10.0049 12.6269 8.64865 12.6269 7.1941C12.6269 5.73956 12.0565 4.38329 11.0338 3.36118C10.0111 2.33907 8.65396 1.76904 7.19852 1.76904C5.76275 1.76904 4.38599 2.33907 3.36325 3.36118C2.3405 4.38329 1.77013 5.73956 1.77013 7.1941C1.77013 8.62899 2.3405 10.0049 3.36325 11.027C4.38599 12.0491 5.76275 12.6192 7.19852 12.6192C8.6343 12.6192 10.0111 12.0491 11.0338 11.027Z"
          fill="#AEB8C2"
        />
      </svg>
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
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.94163 7.17763C8.15292 7.38791 8.15292 7.73199 7.94163 7.94227C7.73035 8.15254 7.38461 8.15254 7.17333 7.94227L4.1001 4.88373L1.02687 7.94227C0.815584 8.15254 0.469846 8.15254 0.258561 7.94227C0.0472765 7.73199 0.0472765 7.38791 0.258561 7.17763L3.351 4.09998L0.258561 1.02232C0.0472765 0.812042 0.0472765 0.467956 0.258561 0.257682C0.469846 0.0474069 0.815584 0.0474069 1.02687 0.257682L4.1001 3.31622L7.17333 0.257682C7.38461 0.0474069 7.73035 0.0474069 7.94163 0.257682C8.15292 0.467956 8.15292 0.812042 7.94163 1.02232L4.8492 4.09998L7.94163 7.17763Z"
              fill="#AEB8C2"
              stroke="#AEB8C2"
              strokeWidth="0.2"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
