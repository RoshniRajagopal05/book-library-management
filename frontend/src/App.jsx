
import { useState } from "react";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Dashboard from "./components/dashboard/Dashboard";
import Library from "./components/library/Library";
import AddBook from "./components/books/AddBook";

import { useAuth } from "./context/AuthContext";

import styles from "./App.module.css";

function App() {
    const [activePage, setActivePage] = useState("login");

    const { isAuthenticated, logout } = useAuth();

    // Logout user
    function handleLogout() {
        logout();
        setActivePage("login");
    }

    // Registration page
    if (activePage === "register") {
        return (
            <Register
                onBack={() => setActivePage("login")}
                onLogin={() => setActivePage("login")}
            />
        );
    }

    // Login page
    if (activePage === "login" || !isAuthenticated) {
        return (
            <Login
                onBack={() => setActivePage("login")}
                onRegister={() => setActivePage("register")}
                onLoginSuccess={() => setActivePage("dashboard")}
            />
        );
    }

    // Main application layout
    return (
        <div className={styles.appLayout}>

            {/* Sidebar */}
            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
                onLogout={handleLogout}
            />

            <div className={styles.mainArea}>

                {/* Header */}
                <Header activePage={activePage} />

                <main className={styles.content}>

                    {/* Dashboard */}
                    {activePage === "dashboard" && (
                        <Dashboard />
                    )}

                    {/* My Library */}
                    {activePage === "library" && (
                        <Library />
                    )}

                    {/* Add Book */}
                    {activePage === "add-book" && (
                        <AddBook />
                    )}

                </main>
            </div>
        </div>
    );
}

export default App;
