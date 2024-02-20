import styles from "./Sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav></AppNav>

      <Outlet />
      <footer className="styles.footer">
        <p>Copyright message in 211 5:00</p>
      </footer>
    </div>
  );
}

export default Sidebar;
