import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  createParser,
} from "nuqs";
import clsx from "clsx";
import { getUsers } from "@/api/users";
import { useDebounce } from "@/hooks/useDebounce";
import type {
  UserSortField,
  SortDirection,
  UserStatus,
  UserRange,
} from "@/types/User";
import type { UserType } from "@/types/Project";
import { USER_STATUS_ORDER } from "@/types/UserStatusOrder";
import css from "@/features/range/index.module.css";
import UserTable from "@/features/range/components/UserTable";
import SearchInput from "@/features/projects/components/SearchInput";
import UserStatusFilter from "@/features/range/components/UserStatusFilter";
import DropdownFilter from "@/features/range/components/DropdownFilter";
import RefreshIcon from "@/features/projects/svg/RefreshIcon";
import Pagination from "@/features/projects/components/Pagination";
import Loader from "@/features/projects/components/Loader";
import CreateUserModal from "@/features/range/components/UserModal/CreateUserModal";
import EditUserModal from "@/features/range/components/UserModal/EditUserModal";
import PlusIcon from "@/features/projects/svg/PlusIcon";

const USERS_PER_PAGE = 10;

const parseAsUserSortField = createParser({
  parse: (value: string): UserSortField => {
    if (value === "name" || value === "status") {
      return value as UserSortField;
    }
    return "name";
  },
  serialize: (value: UserSortField) => value,
});

const parseAsSortDirection = createParser({
  parse: (value: string): SortDirection => {
    if (value === "asc" || value === "desc") {
      return value as SortDirection;
    }
    return "asc";
  },
  serialize: (value: SortDirection) => value,
});

const parseAsUserStatus = createParser<UserStatus | null>({
  parse: (value: string | null): UserStatus | null => {
    if (!value) return null;
    if (USER_STATUS_ORDER.includes(value as UserStatus)) {
      return value as UserStatus;
    }
    return null;
  },
  serialize: (value: UserStatus | null): string => value || "",
});

const parseAsUserType = createParser<UserType | null>({
  parse: (value: string | null): UserType | null => {
    if (!value) return null;
    if (value === "ADMIN" || value === "EMPLOYEE") {
      return value as UserType;
    }
    return null;
  },
  serialize: (value: UserType | null): string => value || "",
});

type Statistics = {
  all: number;
  red: number;
  yellow: number;
  green: number;
  clean: number;
  archived: number;
  my: number;
};

interface StatisticItem {
  key: keyof Statistics;
  label: string;
  isMain?: boolean;
}

const statisticsConfig: StatisticItem[] = [
  { key: "all", label: "All users", isMain: true },
  { key: "red", label: "Red" },
  { key: "yellow", label: "Yellow" },
  { key: "green", label: "Green" },
  { key: "clean", label: "Clean" },
  { key: "archived", label: "Archived" },
  { key: "my", label: "My users" },
];

const useStatistics = (users: UserRange[], totalUsers: number): Statistics => {
  return useMemo(() => {
    const redUsers = users.filter((u) => u.status === "RED").length;
    const yellowUsers = users.filter((u) => u.status === "YELLOW").length;
    const greenUsers = users.filter((u) => u.status === "GREEN").length;
    const cleanUsers = users.filter((u) => u.status === "CLEAN").length;
    const archivedUsers = users.filter((u) => u.status === "ARCHIVED").length;
    const myUsers = 13;

    return {
      all: totalUsers,
      red: redUsers,
      yellow: yellowUsers,
      green: greenUsers,
      clean: cleanUsers,
      archived: archivedUsers,
      my: myUsers,
    };
  }, [users, totalUsers]);
};

const RangePage = () => {
  const [
    { search, sortField, sortDirection, page, status, userType, project },
    setFilters,
  ] = useQueryStates({
    search: parseAsString.withDefault(""),
    sortField: parseAsUserSortField.withDefault("name"),
    sortDirection: parseAsSortDirection.withDefault("asc"),
    page: parseAsInteger.withDefault(1),
    status: parseAsUserStatus,
    userType: parseAsUserType,
    project: parseAsString,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRange | null>(null);

  const queryClient = useQueryClient();
  const debouncedSearchTerm = useDebounce(search, 500);

  const handleSearchChange = (value: string) => {
    setFilters({ search: value, page: 1 });
  };

  const handleStatusChange = (newStatus: UserStatus | null) => {
    setFilters({ status: newStatus, page: 1 });
  };

  const {
    data: paginatedUsers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "users",
      debouncedSearchTerm,
      sortField,
      sortDirection,
      page,
      status,
      userType,
      project,
    ],
    queryFn: () =>
      getUsers({
        search: debouncedSearchTerm || undefined,
        sortField,
        sortDirection,
        skip: (page - 1) * USERS_PER_PAGE,
        take: USERS_PER_PAGE,
        status: status || undefined,
        userType: userType || undefined,
        project: project || undefined,
      }),
  });

  const users = paginatedUsers?.data ?? [];
  const totalUsers = paginatedUsers?.total ?? 0;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  const statistics = useStatistics(users, totalUsers);

  const projects = useMemo(() => {
    const projectSet = new Set<string>();
    users.forEach((user) => {
      if (user.mainProject) projectSet.add(user.mainProject);
      user.otherProjects.forEach((project) => projectSet.add(project));
    });
    return Array.from(projectSet).sort();
  }, [users]);

  const handleSort = (field: UserSortField) => {
    if (sortField === field) {
      setFilters({
        sortDirection: sortDirection === "asc" ? "desc" : "asc",
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

  const handleEditClick = (user: UserRange) => {
    setEditingUser(user);
  };

  const handleCloseEditModal = () => {
    setEditingUser(null);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: null,
      userType: null,
      project: null,
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

          <ul className={css.list}>
            {statisticsConfig.map((item) => (
              <li key={item.key} className={css.item}>
                <span
                  className={clsx(
                    item.isMain && css.headerAllUsersNumbers,
                    !item.isMain && css.headerNumbers
                  )}
                >
                  {statistics[item.key]}
                </span>
                <span
                  className={clsx(
                    item.isMain && css.headerAllUsers,
                    !item.isMain && css.headerText
                  )}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
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

            <UserStatusFilter
              selectedStatus={status}
              onStatusChange={handleStatusChange}
            />

            <DropdownFilter
              label="User types"
              options={["ADMIN", "EMPLOYEE"]}
              selectedValue={userType}
              onSelect={(value) =>
                setFilters({ userType: (value as UserType) || null, page: 1 })
              }
              placeholder="All user types"
            />

            <DropdownFilter
              label="Projects"
              options={projects}
              selectedValue={project}
              onSelect={(value) => setFilters({ project: value, page: 1 })}
              placeholder="All projects"
            />

            <button
              type="button"
              className={css.refreshButton}
              aria-label="Refresh"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["users"] });
              }}
            >
              <RefreshIcon />
            </button>
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
        onEdit={handleEditClick}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditUserModal
        isOpen={editingUser !== null}
        user={editingUser}
        onClose={handleCloseEditModal}
      />
    </div>
  );
};

export default RangePage;
