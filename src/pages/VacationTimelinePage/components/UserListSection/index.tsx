import Avatar from "@/components/Avatar";
import css from "../../index.module.css";
import type { VacationStats } from "../../types/vacations";
import { formatVacationRange } from "../../utils/dateFormatting";

type User = {
  id: string;
  name: string;
  role?: string;
  vacationStatus: VacationStats;
};

type UserListSectionProps = {
  title: string;
  users: User[];
  statsKey: keyof VacationStats;
};

export default function UserListSection({
  title,
  users,
  statsKey,
}: UserListSectionProps) {
  return (
    <>
      {users.length > 0 && (
        <div className={css.usersListSection}>
          <h3 className={css.usersListSubtitle}>{title}</h3>

          {users.map((user) => {
            const status = user.vacationStatus;
            const ranges = status[statsKey];

            return (
              <div key={user.id} className={css.usersListItem}>
                <Avatar name={user.name} />

                <div className={css.usersListItemContent}>
                  <div className={css.usersListItemInfo}>
                    {user.role && (
                      <span className={css.usersListItemRole}>{user.role}</span>
                    )}

                    <span className={css.usersListItemDates}>
                      {ranges.map((range, index) => (
                        <div key={index}>
                          {formatVacationRange(range)}
                        </div>
                      ))}
                    </span>
                  </div>

                  <span className={css.usersListItemName}>{user.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
