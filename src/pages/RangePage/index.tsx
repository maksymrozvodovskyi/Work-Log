import { useState } from "react";
import { Link } from "react-router-dom";
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
import { USER_QUERY_KEYS } from "@/features/range/queryKeys";
import { parsers } from "@/utils/parsers";
import { createSearchHandler } from "@/utils/filters";
import { SORT_FIELDS, DEFAULT_SORT_FIELD } from "@/constants/sort";
import {
  transformApiUserToUserRange,
  type ApiUserType,
} from "@/utils/userTransformers";
import { useAuthStore } from "@/stores/authStore";
import css from "@/features/range/index.module.css";
import UserTable from "@/features/range/components/UserTable";
import SearchInput from "@/components/SearchInput";
import StatusFilter from "@/components/StatusFilter";
import FilterButton from "@/components/FilterButton";
import DropdownFilter from "@/features/range/components/DropdownFilter";
import Pagination from "@/components/Pagination";
import UserModal from "@/features/range/components/UserModal";
import PlusIcon from "@/components/svg/PlusIcon";
import UserStatistics from "@/features/range/components/UserStatistics";
import Avatar from "@/components/Avatar";
import { USERS_PER_PAGE } from "@/features/range/constants";

const parseAsUserSortField = parsers.sortField<UserSortFieldType>(
  [...SORT_FIELDS],
  DEFAULT_SORT_FIELD,
);

const parseAsSortDirection = parsers.sortDirection();

const parseAsUserStatus =
  parsers.statusArray<UserStatusType>(USER_STATUS_ORDER);

const parseAsUserType = parsers.enum<UserRoleType>(USER_TYPES);

const RangePage = () => {
  const [
    { search, sortField, sortDirection, page, statuses, userType },
    setFilters,
  ] = useQueryStates({
    search: parseAsString.withDefault(""),
    sortField: parseAsUserSortField.withDefault("name"),
    sortDirection: parseAsSortDirection.withDefault("asc"),
    page: parseAsInteger.withDefault(1),
    statuses: parseAsUserStatus.withDefault([]),
    userType: parseAsUserType,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user: currentUser } = useAuthStore();

  const debouncedSearchTerm = useDebounce(search, 500);

  const handleSearchChange = createSearchHandler(setFilters);
  const handleStatusChange = (newStatuses: UserStatusType[]) => {
    setFilters({
      statuses: newStatuses.length > 0 ? newStatuses : null,
      page: 1,
    });
  };

  const {
    data: paginatedUsers,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [
      USER_QUERY_KEYS.users,
      debouncedSearchTerm,
      sortField,
      sortDirection,
      page,
      statuses || null,
      userType,
    ],
    queryFn: () =>
      getUsers({
        name: debouncedSearchTerm || undefined,
        sortField: sortField,
        sortOrder: sortDirection,
        skip: (page - 1) * USERS_PER_PAGE,
        take: USERS_PER_PAGE,
        status: statuses || undefined,
        userType: userType || undefined,
      }),
    select: (data: PaginatedResponseType<ApiUserType>) => {
      return {
        data: data.data.map((user) => transformApiUserToUserRange(user)),
        total: data.total,
      };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });

  const users = paginatedUsers?.data ?? [];
  const totalUsers = paginatedUsers?.total ?? 0;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
  const isDisabled = isLoading || isFetching;

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
      statuses: null,
      userType: null,
      sortField: "name",
      sortDirection: "asc",
      page: 1,
    });
  };

  return (
    <div className={css.pageContainer}>
      <header className={css.header}>
        <div className={css.headerLeft}>
          <div className={css.buttonsWrapper}>
            <Link to="/range" className={css.link}>
              Range
            </Link>
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
            <span className={css.notificationDot}></span>
          </button>
          <button
            type="button"
            className={css.profileButton}
            aria-label="User profile"
          >
            {currentUser && <Avatar name={currentUser.name} status="GREEN" />}
          </button>
        </div>
      </header>

      <section className={css.filterWrapper} aria-labelledby="filter-section">
        <SearchInput
          value={search}
          onChange={handleSearchChange}
          disabled={isDisabled}
        />

        <div className={css.filterButtonsWrapper}>
          <div className={css.filterControls}>
            <FilterButton
              aria-label="Clear all filters"
              onClick={handleClearFilters}
              disabled={isDisabled}
            />

            <StatusFilter
              statusOrder={USER_STATUS_ORDER}
              statusMap={userStatusMap}
              selectedStatuses={statuses || []}
              onStatusChange={handleStatusChange}
              entityType="users"
              disabled={isDisabled}
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
              disabled={isDisabled}
            />
          </div>

          <button
            type="button"
            className={css.createButton}
            onClick={() => setIsModalOpen(true)}
            disabled={isDisabled}
          >
            <span className={css.createButtonText}>Add user</span>
            <div className={css.createButtonIcon}>
              <PlusIcon />
            </div>
          </button>
        </div>
      </section>

      {isError && <div>{(error as Error).message}</div>}

      <UserTable
        users={users}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        isLoading={isLoading}
        isFetching={isFetching}
        disabled={isDisabled}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        disabled={isDisabled}
      />

      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default RangePage;
