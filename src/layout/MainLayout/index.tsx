import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import css from "./index.module.css";

export default function MainLayout() {
  return (
    <div className={css.wrapper}>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
