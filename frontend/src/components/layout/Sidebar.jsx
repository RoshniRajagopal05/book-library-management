
import {
    BookOpen,
    LayoutDashboard,
    Library,
    Plus,
    BookMarked,
    LogOut
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import styles from "./Sidebar.module.css";

function Sidebar({ activePage, setActivePage, onLogout }) {

    const { user } = useAuth();

    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            id: "library",
            label: "My Library",
            icon: Library
        },
        {
            id: "add-book",
            label: "Add a Book",
            icon: Plus
        }
    ];

    return (
        <aside className={styles.sidebar}>

            {/* Brand */}
            <div className={styles.brand}>
                <div className={styles.logo}>
                    <BookOpen size={24} />
                </div>

                <div>
                    <h2>Folio</h2>
                    <span>BOOK LIBRARY</span>
                </div>
            </div>

            <div className={styles.sectionLabel}>
                MENU
            </div>

            {/* Navigation */}
            <nav className={styles.navigation}>

                {menuItems.map((item) => {

                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            className={`${styles.navItem} ${
                                activePage === item.id
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() => setActivePage(item.id)}
                        >
                            <Icon size={19} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}

            </nav>

            {/* Quote */}
            <div className={styles.sidebarBottom}>

                <div className={styles.quoteIcon}>
                    <BookMarked size={22} />
                </div>

                <p>
                    A room without books
                    is like a body without a soul.
                </p>

                <span>— Marcus Tullius Cicero</span>

            </div>

            {/* Logout */}
            <button
                className={styles.logoutButton}
                onClick={onLogout}
                title="Log out"
            >
                <LogOut size={19} />
                <span>Log out</span>
            </button>

            {/* User Profile */}
            <div className={styles.profile}>

                <div className={styles.avatar}>
                    {user?.username?.charAt(0).toUpperCase() || "R"}
                </div>

                <div className={styles.profileInfo}>
                    <strong>{user?.username || "Reader"}</strong>
                    <span>Book enthusiast</span>
                </div>

            </div>

        </aside>
    );
}

export default Sidebar;
