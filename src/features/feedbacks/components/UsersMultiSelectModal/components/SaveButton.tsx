import css from "./UsersMultiSelectModal.module.css";

type SaveButtonProps = {
  onSave: () => void;
  disabled: boolean;
};

export default function SaveButton({ onSave, disabled }: SaveButtonProps) {
  return (
    <button
      type="button"
      className={css.saveButton}
      onClick={onSave}
      disabled={disabled}
    >
      Add
    </button>
  );
}
