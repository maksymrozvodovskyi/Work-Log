import BaseModal from "@/components/BaseModal";
import Avatar from "@/components/Avatar";
import RightArrowIcon from "@/components/svg/RightArrowIcon";
import css from "./index.module.css";
import type { VacationDetailsModalData } from "@/features/vacations/types";

type Props = {
  data: VacationDetailsModalData;
  onClose: () => void;
};

export default function VacationDetailsModal({ data, onClose }: Props) {
  return (
    <BaseModal
      isOpen={true}
      onClose={onClose}
      headerContent={
        <div className={css.header}>
          <div className={css.headerTop}>
            <div className={css.title}>Manage days</div>

            <button
              className={css.arrowBtn}
              type="button"
              onClick={onClose}
              aria-label="Close"
            >
              <RightArrowIcon fill="#F5F6FA" />
            </button>
          </div>

          <div className={css.userRow}>
            <Avatar name={data.userName} size="small" />
            <div className={css.userMeta}>
              <span>{data.userName}</span>
              {data.workStart.date && <span> • </span>}
              {data.workStart.date && <span>{data.workStart.date}</span>}
            </div>
          </div>
        </div>
      }
      showOverlay={false}
      modalStyle={{
        width: "336px",
        border: "1px solid #222327",
        borderRadius: "8px 0 0 8px",
        boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.4)",
        background: "#383d44",
        zIndex: 1100,
      }}
    >
      <div className={css.body}>
        <div className={css.yearsList}>
          {data.years.map((y, index) => {
            const isCurrentYear = index === 0;
            const total = y.usedDays + y.remainingDays;

            return (
              <div key={y.label} className={css.yearBlock}>
                <div className={css.yearLeft}>
                  <div className={css.yearLabel}>{y.label}</div>

                  <div className={css.yearSub}>
                    {isCurrentYear && (
                      <>
                        <span className={css.subLabel}>Taken:</span>{" "}
                        {y.usedDays}
                        <span className={css.dot}>•</span>
                        <span className={css.subLabel}>Left:</span>{" "}
                        {y.remainingDays}
                      </>
                    )}

                    {!isCurrentYear && (
                      <>
                        <span className={css.subLabel}>Days taken:</span>{" "}
                        {y.usedDays}
                      </>
                    )}
                  </div>
                </div>

                <div className={css.yearRight}>
                  {isCurrentYear && (
                    <>
                      <input
                        type="number"
                        className={css.input}
                        value={y.usedDays}
                        readOnly
                      />
                      <span className={css.slash}>/</span>
                      <input
                        type="number"
                        className={css.input}
                        value={total}
                        readOnly
                      />
                    </>
                  )}

                  {!isCurrentYear && (
                    <div className={css.valueBox}>{y.usedDays}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className={css.hint}>
          Відлік відпусток юзера починається з Нового року, а не з першого
          робочого дня
        </p>
      </div>
    </BaseModal>
  );
}
