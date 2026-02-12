import EyeOpenIcon from "@/components/svg/EyeOpenIcon";
import EyeClosedIcon from "@/components/svg/EyeClosedIcon";

type EyeIconPropsType = {
  isOpen: boolean;
};

export default function EyeIcon({ isOpen }: EyeIconPropsType) {
  if (isOpen) {
    return <EyeOpenIcon />;
  }

  return <EyeClosedIcon />;
}