import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/users";
import { USER_QUERY_KEYS } from "@/features/range/queryKeys";
import { formatDateOfBirth } from "@/utils/dateUtils";
import Loader from "@/components/Loader";
import css from "./ResumeTab.module.css";

const ResumeTab = () => {
  const { id: userId } = useParams<{ id: string }>();

  const { data: user, isLoading, isError } = useQuery({
    queryKey: [USER_QUERY_KEYS.users, userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className={css.resumeContainer}>
        <div className={css.loaderWrapper}>
          <Loader size="medium" />
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className={css.resumeContainer}>
        <div className={css.errorWrapper}>
          <span className={css.errorText}>Error loading user data</span>
        </div>
      </div>
    );
  }

  const hasContacts =
    user.email || user.skype || user.phoneNumber || user.dateOfBirth || user.location;
  const hasSkills = user.skills && user.skills.length > 0;
  const hasCompanyInfo = user.role || user.status;
  const hasProjects = user.projects && user.projects.length > 0;

  return (
    <div className={css.resumeContainer}>
      <div className={css.resumeContent}>
        <div className={css.leftColumn}>
          {hasContacts && (
            <section className={css.section}>
              <h3 className={css.sectionTitle}>Contacts</h3>
              {user.email && (
                <div className={css.contactItem}>
                  <span className={css.contactLabel}>Email:</span>
                  <span className={css.contactValue}>{user.email}</span>
                </div>
              )}
              {user.skype && (
                <div className={css.contactItem}>
                  <span className={css.contactLabel}>Skype:</span>
                  <span className={css.contactValue}>{user.skype}</span>
                </div>
              )}
              {user.phoneNumber && (
                <div className={css.contactItem}>
                  <span className={css.contactLabel}>Phone Number:</span>
                  <span className={css.contactValue}>{user.phoneNumber}</span>
                </div>
              )}
              {user.dateOfBirth && (
                <div className={css.contactItem}>
                  <span className={css.contactLabel}>Date of birth:</span>
                  <span className={css.contactValue}>
                    {formatDateOfBirth(user.dateOfBirth) || user.dateOfBirth}
                  </span>
                </div>
              )}
              {user.location && (
                <div className={css.contactItem}>
                  <span className={css.contactLabel}>Location:</span>
                  <span className={css.contactValue}>{user.location}</span>
                </div>
              )}
            </section>
          )}

          {hasSkills && (
            <section className={css.section}>
              <h3 className={css.sectionTitle}>Skills</h3>
              <p className={css.skillsText}>{user.skills!.join(", ")}</p>
            </section>
          )}
        </div>

        <div className={css.dividerWrapper}>
          <div className={css.divider} />
        </div>

        <div className={css.rightColumn}>
          {hasCompanyInfo && (
            <section className={css.section}>
              <h3 className={css.sectionTitle}>Company info</h3>
              {user.role && (
                <div className={css.infoItem}>
                  <span className={css.infoLabel}>Role:</span>
                  <span className={css.infoValue}>{user.role}</span>
                </div>
              )}
              {user.status && (
                <div className={css.infoItem}>
                  <span className={css.infoLabel}>Status:</span>
                  <span className={css.infoValue}>{user.status}</span>
                </div>
              )}
            </section>
          )}

          {hasProjects && (
            <section className={css.section}>
              <h3 className={css.sectionTitle}>Projects</h3>
              <div className={css.projectsList}>
                {user.projects!.map((project) => (
                  <div key={project.id} className={css.projectItem}>
                    <span className={css.projectName}>{project.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeTab;
