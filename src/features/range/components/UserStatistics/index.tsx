import clsx from "clsx";
import type { UserRangeType } from "@/types/User";
import css from "@/features/range/index.module.css";

type Statistics = {
  all: number;
  red: number;
  yellow: number;
  green: number;
  clean: number;
  archived: number;
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
];

interface UserStatisticsProps {
  users: UserRangeType[];
  totalUsers: number;
}

const UserStatistics = ({ users, totalUsers }: UserStatisticsProps) => {
  const redUsers = users.filter((u) => u.status === "RED").length;
  const yellowUsers = users.filter((u) => u.status === "YELLOW").length;
  const greenUsers = users.filter((u) => u.status === "GREEN").length;
  const cleanUsers = users.filter((u) => u.status === "CLEAN").length;
  const archivedUsers = users.filter((u) => u.status === "ARCHIVED").length;

  const statistics: Statistics = {
    all: totalUsers,
    red: redUsers,
    yellow: yellowUsers,
    green: greenUsers,
    clean: cleanUsers,
    archived: archivedUsers,
  };

  return (
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
  );
};

export default UserStatistics;
