import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { getUsers } from "@/api/users";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  UserSortFieldType,
  UserStatusType,
  PaginatedResponseType,
} from "@/types/User";
import type { UserRoleType } from "@/types/Project";
import { USER_TYPES } from "@/types/Project";
import { USER_STATUS_ORDER } from "@/types/UserStatusOrder";
import { userStatusMap } from "@/types/UserStatusMap";
import { USER_QUERY_KEYS } from "@/lib/queryKeys";
import { parsers } from "@/utils/parsers";
import { createSearchHandler, createStatusHandler } from "@/utils/filters";
import { SORT_FIELDS, DEFAULT_SORT_FIELD } from "@/constants/sort";
import {
  transformApiUserToUserRange,
  type ApiUserType,
} from "@/utils/userTransformers";
import css from "@/features/range/index.module.css";
import UserTable from "@/features/range/components/UserTable";
import SearchInput from "@/features/projects/components/SearchInput";
import StatusFilter from "@/components/StatusFilter";
import DropdownFilter from "@/features/range/components/DropdownFilter";
import Pagination from "@/features/projects/components/Pagination";
import Loader from "@/features/projects/components/Loader";
import UserModal from "@/features/range/components/UserModal";
import PlusIcon from "@/features/projects/svg/PlusIcon";
import UserStatistics from "@/features/range/components/UserStatistics";
import { USERS_PER_PAGE } from "@/features/range/constants";

const parseAsUserSortField = parsers.sortField<UserSortFieldType>(
  [...SORT_FIELDS],
  DEFAULT_SORT_FIELD
);

const parseAsSortDirection = parsers.sortDirection();

const parseAsUserStatus = parsers.status<UserStatusType>(USER_STATUS_ORDER);

const parseAsUserType = parsers.enum<UserRoleType>(USER_TYPES);

const RangePage = () => {
  const [
    { search, sortField, sortDirection, page, status, userType },
    setFilters,
  ] = useQueryStates({
    search: parseAsString.withDefault(""),
    sortField: parseAsUserSortField.withDefault("name"),
    sortDirection: parseAsSortDirection,
    page: parseAsInteger.withDefault(1),
    status: parseAsUserStatus,
    userType: parseAsUserType,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(search, 500);

  const handleSearchChange = createSearchHandler(setFilters);
  const handleStatusChange = createStatusHandler<UserStatusType>(setFilters);

  const {
    data: paginatedUsers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      USER_QUERY_KEYS.users,
      debouncedSearchTerm,
      sortField,
      sortDirection,
      page,
      status,
      userType,
    ],
    queryFn: () =>
      getUsers({
        name: debouncedSearchTerm || undefined,
        sortOrder: sortField === "name" ? sortDirection || "asc" : undefined,
        skip: (page - 1) * USERS_PER_PAGE,
        take: USERS_PER_PAGE,
        status: status || undefined,
        userType: userType || undefined,
      }),
    select: (data: PaginatedResponseType<ApiUserType>) => {
      return {
        data: data.data.map((user) => transformApiUserToUserRange(user)),
        total: data.total,
      };
    },
  });

  const users = paginatedUsers?.data ?? [];
  const totalUsers = paginatedUsers?.total ?? 0;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  const handleSort = (field: UserSortFieldType) => {
    const currentDirection = sortDirection || "asc";
    if (sortField === field) {
      setFilters({
        sortDirection: currentDirection === "asc" ? "desc" : "asc",
        page: 1,
      });
    } else {
      setFilters({
        sortField: field,
        sortDirection: "asc",
        page: 1,
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: null,
      userType: null,
      sortField: "name",
      sortDirection: "asc",
      page: 1,
    });
  };

  return (
    <div>
      <header className={css.header}>
        <div className={css.headerLeft}>
          <div className={css.buttonsWrapper}>
            <h1 className={css.link}>Range</h1>
          </div>

          <UserStatistics users={users} totalUsers={totalUsers} />
        </div>

        <div className={css.headerActions}>
          <button
            type="button"
            className={css.notificationButton}
            aria-label="Notifications"
          >
            <img src="/notification.svg" alt="" width="24" height="24" />
          </button>
          <button
            type="button"
            className={css.profileButton}
            aria-label="User profile"
          >
            <div className={css.profileAvatar}></div>
          </button>
        </div>
      </header>

      <section className={css.filterWrapper} aria-labelledby="filter-section">
        <SearchInput value={search} onChange={handleSearchChange} />

        <div className={css.filterButtonsWrapper}>
          <div className={css.filterControls}>
            <button
              type="button"
              aria-label="Clear all filters"
              className={css.filterButton}
              onClick={handleClearFilters}
            >
              <img src="/filter.svg" alt="" width="16" height="18" />
            </button>

            <StatusFilter
              statusOrder={USER_STATUS_ORDER}
              statusMap={userStatusMap}
              selectedStatus={status}
              onStatusChange={handleStatusChange}
              entityType="users"
            />

            <DropdownFilter
              label="User types"
              options={USER_TYPES}
              selectedValue={userType}
              onSelect={(value) =>
                setFilters({
                  userType: (value as UserRoleType) || null,
                  page: 1,
                })
              }
              placeholder="All user types"
            />
          </div>

          <button
            type="button"
            className={css.createButton}
            onClick={() => setIsModalOpen(true)}
          >
            <span className={css.createButtonText}>Add user</span>
            <div className={css.createButtonIcon}>
              <PlusIcon />
            </div>
          </button>
        </div>
      </section>

      {isLoading && <Loader size="large" />}
      {isError && <div>{(error as Error).message}</div>}

      <UserTable
        users={users}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default RangePage;
