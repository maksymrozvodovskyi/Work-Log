import css from "../index.module.css";

const statusOptions = [
  {
    color: "green",
    ariaLabel: "Filter by in progress projects",
    className: "statusCircleGreen",
  },
  {
    color: "orange",
    ariaLabel: "Filter by completed projects",
    className: "statusCircleOrange",
  },
  {
    color: "pink",
    ariaLabel: "Filter by pending projects",
    className: "statusCirclePink",
  },
  {
    color: "gray",
    ariaLabel: "Filter by archived projects",
    className: "statusCircleGray",
  },
];

const StatusFilter = () => (
  <div className={css.statusCircles}>
    {statusOptions.map(({ className, ariaLabel }) => (
      <button
        key={className}
        type="button"
        className={`${css.statusCircle} ${css[className]}`}
        aria-label={ariaLabel}
      />
    ))}
  </div>
);

export default StatusFilter;
