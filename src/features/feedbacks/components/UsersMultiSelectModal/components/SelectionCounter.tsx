import css from "./UsersMultiSelectModal.module.css";

type SelectionCounterProps = {
  selected: number;
  total: number;
};

export default function SelectionCounter({ selected, total }: SelectionCounterProps) {
  return (
    <div className={css.selectedCounter}>
      Selected {selected} / {total}
    </div>
  );
}