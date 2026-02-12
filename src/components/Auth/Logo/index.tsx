import css from "./Logo.module.css";
import LogoIcon from "@/components/svg/LogoIcon";

export default function Logo() {
  return (
    <div className={css.logo}>
      <LogoIcon />
    </div>
  );
}
