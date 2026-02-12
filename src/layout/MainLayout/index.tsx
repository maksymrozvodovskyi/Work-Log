import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import css from "./index.module.css";

export default function MainLayout() {
  return (
    <div className={css.wrapper}>
      <Sidebar />
      <main>
        <Suspense fallback={<div className={css.pageFallback}><Loader size="large" inline /></div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
