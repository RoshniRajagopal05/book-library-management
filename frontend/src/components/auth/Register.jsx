
import { useState } from "react";
import {
    ArrowLeft,
    BookOpen,
    Eye,
    EyeOff
} from "lucide-react";

import { registerUser } from "../../services/authService";
import styles from "./Register.module.css";

function Register({ onBack, onLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await registerUser({
                username,
                email,
                password
            });

            setMessage("Account created successfully! Please sign in.");

            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } catch (err) {
            const detail = err.response?.data?.detail;

            if (err.response?.status === 409) {
                setError("An account with these details already exists.");
            } else if (Array.isArray(detail)) {
                setError(detail.map(item => item.msg).join(", "));
            } else if (typeof detail === "string") {
                setError(detail);
            } else if (err.code === "ECONNABORTED") {
                setError("The server took too long to respond.");
            } else if (!err.response) {
                setError("Cannot connect to the server. Please try again.");
            } else {
                setError("Registration failed. Please try again.");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.registerPage}>

            <section className={styles.brandPanel}>
                <div className={styles.brand}>
                    <BookOpen size={30} strokeWidth={1.7} />
                    <span>Folio</span>
                </div>

                <div className={styles.brandContent}>
                    <span className={styles.eyebrow}>
                        A HOME FOR EVERY STORY
                    </span>

                    <h1>
                        Every book has
                        <br />
                        a place here.
                    </h1>

                    <p>
                        Create your personal reading space, organise
                        your collection, and keep track of every story
                        along the way.
                    </p>
                </div>

                <div className={styles.quote}>
                    "A room without books is like a body without a soul."
                    <span>— Marcus Tullius Cicero</span>
                </div>
            </section>

            <section className={styles.formPanel}>

                <button
                    className={styles.backButton}
                    onClick={onBack}
                >
                    <ArrowLeft size={17} />
                    Back to Folio
                </button>

                <div className={styles.formContainer}>

                    <span className={styles.formEyebrow}>
                        GET STARTED
                    </span>

                    <h2>Create your account</h2>

                    <p className={styles.subtitle}>
                        Your personal library is just a few details away.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className={styles.formGroup}>
                            <label htmlFor="username">
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className={styles.passwordWrapper}>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword">
                                Confirm password
                            </label>

                            <div className={styles.passwordWrapper}>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Enter your password again"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />
                                    }
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className={styles.errorMessage} role="alert">
                                {error}
                            </p>
                        )}

                        {message && (
                            <p className={styles.message} role="status">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>

                        {message && (
                            <button
                                type="button"
                                className={styles.submitButton}
                                onClick={onLogin}
                                style={{ marginTop: "10px" }}
                            >
                                Go to Login
                            </button>
                        )}

                    </form>

                    <p className={styles.loginText}>
                        Already have an account?{" "}
                        <button type="button" onClick={onLogin}>
                            Sign in
                        </button>
                    </p>

                </div>

                <p className={styles.footerText}>
                    © 2026 Folio. Made for the love of reading.
                </p>

            </section>
        </div>
    );
}

export default Register;
