
import { useState } from "react";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Dashboard from "./components/dashboard/Dashboard";

import { useAuth } from "./context/AuthContext";

import styles from "./App.module.css";

function App() {
    const [activePage, setActivePage] = useState("login");

    const { isAuthenticated, logout } = useAuth();

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

    // Dashboard content
    const pageContent = {
        library: {
            heading: "Your personal library",
            description: "Your complete book collection will appear here."
        },
        "add-book": {
            heading: "Add a new book",
            description: "Start building your personal reading collection."
        }
    };

    const currentContent = pageContent[activePage];

    return (
        <div className={styles.appLayout}>

           <Sidebar
    activePage={activePage}
    setActivePage={setActivePage}
    onLogout={handleLogout}
/>

            <div className={styles.mainArea}>

                <Header activePage={activePage} />

                <main className={styles.content}>

                    {activePage === "dashboard" ? (
                        <Dashboard />
                    ) : (
                        <section className={styles.welcomeCard}>
                            <h2>{currentContent.heading}</h2>
                            <p>{currentContent.description}</p>
                        </section>
                    )}

                    <button
                        className={styles.primaryButton}
                        onClick={handleLogout}
                    >
                        Log out
                    </button>

                </main>
            </div>
        </div>
    );
}

export default App;
