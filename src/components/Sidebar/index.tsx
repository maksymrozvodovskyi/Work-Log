import { NavLink } from "react-router-dom";
import css from "./Sidebar.module.css";
import { SidebarContent } from "./content";

export default function Sidebar() {
  return (
    <aside className={css.aside}>
      <ul className={css.list}>
        {SidebarContent.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive && item.path !== "/"
                  ? `${css.link} ${css.active}`
                  : css.link
              }
              aria-label={item.label}
            >
              {({ isActive }) => item.icon(isActive)}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
