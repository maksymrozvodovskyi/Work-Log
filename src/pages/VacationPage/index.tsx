import SearchInput from "@/components/SearchInput";
import css from "./index.module.css";
import { useAuthStore } from "@/stores/authStore";
import Avatar from "@/components/Avatar";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import VacationsTable from "./components/VacationTable";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getVacations } from "@/api/vacations";
import { useDebounce } from "@/hooks/useDebounce";
import { VACATIONS_QUERY_KEY } from "@/features/vacations/queryKeys";
import { useQueryState, parseAsStringEnum, parseAsInteger } from "nuqs";
import type { SortBy, SortOrder } from "@/api/vacations";
import { PAGE_SIZE } from "@/features/vacations/constants";
import Pagination from "@/components/Pagination";

const sortByParser = parseAsStringEnum<SortBy>(["createdAt", "name", "role"]);
const sortOrderParser = parseAsStringEnum<SortOrder>(["asc", "desc"]);

export default function VacationPage() {
  const { user: currentUser } = useAuthStore();

  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    sortByParser.withDefault("createdAt"),
  );

  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    sortOrderParser.withDefault("asc"),
  );

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      VACATIONS_QUERY_KEY.vacations,
      debouncedSearchQuery,
      sortBy,
      sortOrder,
      page,
    ],
    queryFn: () =>
      getVacations({
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        sortBy: sortBy,
        sortOrder: sortOrder,
        search: debouncedSearchQuery || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <div className={css.pageContainer}>
      <header className={css.appHeader}>
        <div className={css.appHeaderStatsWrapper}>
          <div className={css.appHeaderLeft}>
            <NavLink to="/vacations" className={css.brandTitle}>
              Vacations
            </NavLink>

            <nav className={css.tabs} aria-label="Page tabs">
              <NavLink
                to="/vacations"
                className={({ isActive }) =>
                  clsx(css.tabsItem, isActive && css.tabsItemActive)
                }
              >
                Main
              </NavLink>
              <NavLink
                to="/vacations/timeline"
                className={({ isActive }) =>
                  clsx(css.tabsItem, isActive && css.tabsItemActive)
                }
              >
                Timeline
              </NavLink>
            </nav>
          </div>

          <div className={css.appHeaderStats}>
            <ul className={css.statsList}>
              <li className={css.statsItem}>
                <span className={css.allUsersValue}>{data?.total ?? 0}</span>
                <span className={css.allUsersLabel}>All users</span>
              </li>

              <li className={css.statsItem}>
                <span className={css.statValue}>{data?.stats.red ?? 0}</span>
                <span className={css.statLabel}>Red</span>
              </li>

              <li className={css.statsItem}>
                <span className={css.statValue}>{data?.stats.yellow ?? 0}</span>
                <span className={css.statLabel}>Yellow</span>
              </li>

              <li className={css.statsItem}>
                <span className={css.statValue}>{data?.stats.green ?? 0}</span>
                <span className={css.statLabel}>Green</span>
              </li>

              <li className={css.statsItem}>
                <span className={css.statValue}>{data?.stats.clean ?? 0}</span>
                <span className={css.statLabel}>Clean</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={css.headerRight}>
          <button type="button" className={css.notificationButton}>
            <img src="/notification.svg" alt="" width="24" height="24" />
            <span className={css.notificationDot} />
          </button>

          <button type="button" className={css.profileButton}>
            {currentUser && <Avatar name={currentUser.name} status="GREEN" />}
          </button>
        </div>
      </header>

      <div className={css.searchInputWrapper}>
        <SearchInput
          value={searchQuery}
          onChange={(v) => {
            setSearchQuery(v);
            setPage(1);
          }}
          placeholder="Search by name, skills etc."
        />
      </div>

      <div className={css.vacationsTableWrapper}>
        {isError ? (
          <div className={css.errorMessage}>Error loading vacations</div>
        ) : (
          <VacationsTable
            users={data?.items ?? []}
            isLoading={isLoading}
            sortField={sortBy}
            sortDirection={sortOrder}
            onSort={(field) => {
              setPage(1);
              if (sortBy === field) {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              } else {
                setSortBy(field);
                setSortOrder("asc");
              }
            }}
          />
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        disabled={isLoading}
        onPageChange={(nextPage) => setPage(nextPage)}
      />
    </div>
  );
}
