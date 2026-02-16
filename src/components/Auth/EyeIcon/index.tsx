import EyeOpenIcon from "@/components/svg/EyeOpenIcon";

type EyeIconPropsType = {
  isOpen: boolean;
};

export default function EyeIcon({ isOpen }: EyeIconPropsType) {
  if (isOpen) {
    return <EyeOpenIcon />;
  }

  return (
    <img
      src="/eye-closed.svg"
      alt="Hide password"
      width={24}
      height={24}
    />
  );
}