import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/users";
import { USER_QUERY_KEYS } from "@/features/range/queryKeys";
import Loader from "@/components/Loader";
import css from "./SubTechnologiesTab.module.css";

const SubTechnologiesTab = () => {
  const { id: userId } = useParams<{ id: string }>();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [USER_QUERY_KEYS.users, userId],
    queryFn: () => getUserById(userId!),
    enabled: Boolean(userId),
  });

  if (isLoading) {
    return (
      <div className={css.container}>
        <div className={css.loaderWrapper}>
          <Loader size="medium" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className={css.container}>
        <div className={css.errorWrapper}>
          <span className={css.errorText}>Error loading user data</span>
        </div>
      </div>
    );
  }

  const skills = user.skills ?? [];

  if (skills.length === 0) {
    return (
      <div className={css.container}>
        <div className={css.emptyState}>
          <span className={css.emptyText}>No skills available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <div className={css.skillsGrid}>
        {skills.map((skill) => (
          <div key={skill} className={css.skillTag}>
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubTechnologiesTab;
