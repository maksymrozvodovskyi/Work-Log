import { Outlet } from "react-router-dom";
import Logo from "@/components/Auth/Logo";
import css from "./index.module.css";

export default function AuthLayout() {
  return (
    <div className={css.container}>
      <div className={css.content}>
        <Logo />
        <Outlet />
      </div>
    </div>
  );
}
