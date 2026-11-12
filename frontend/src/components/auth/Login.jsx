
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Eye,
  EyeOff
} from "lucide-react";
import {
    loginUser,
    getCurrentUser
} from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { setAuthToken } from "../../services/api";


import styles from "./Login.module.css";


function Login({ onBack, onRegister, onLoginSuccess }) {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

 

async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
        setLoading(true);

        // Step 1: Authenticate using email and password
        const data = await loginUser({
            email,
            password
        });

        // Step 2: Set JWT before requesting current user
        setAuthToken(data.access_token);

        // Step 3: Validate the JWT
        const userData = await getCurrentUser();

        // Step 4: Store verified token and user
        login(data.access_token, userData);

        // Step 5: Navigate to dashboard
        onLoginSuccess();

    } catch (err) {

        // Clear JWT if login or token validation fails
        setAuthToken(null);

        if (err.response?.status === 401) {
            setError("Incorrect email or password.");
        } else if (err.code === "ECONNABORTED") {
            setError("The server took too long to respond.");
        } else if (!err.response) {
            setError(
                "Unable to connect to the server. Please try again."
            );
        } else {
            setError("Login failed. Please try again.");
        }

    } finally {
        setLoading(false);
    }
}


  return (
    <div className={styles.loginPage}>

      {/* Brand Section */}

      <section className={styles.brandPanel}>

        <div className={styles.brand}>
          <BookOpen size={30} strokeWidth={1.7} />
          <span>Folio</span>
        </div>

        <div className={styles.brandContent}>

          <span className={styles.eyebrow}>
            WELCOME BACK
          </span>

          <h1>
            Your next
            <br />
            chapter awaits.
          </h1>

          <p>
            Pick up where you left off. Your personal
            reading collection is always waiting for you.
          </p>

        </div>

        <div className={styles.quote}>
          "There is no friend as loyal as a book."
          <span>— Ernest Hemingway</span>
        </div>

      </section>

      {/* Login Form Section */}

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
            YOUR READING SPACE
          </span>

          <h2>Welcome back</h2>

          <p className={styles.subtitle}>
            Sign in to continue your reading journey.
          </p>

          <form onSubmit={handleSubmit}>

            <div className={styles.formGroup}>

              <label htmlFor="loginEmail">
                Email address
              </label>

             <input
               id="loginEmail"
               name="email"
               type="email"
               placeholder="you@example.com"
               value={email}
               onChange={(event) => setEmail(event.target.value)}
               required
              /> 

            </div>

            <div className={styles.formGroup}>

              <label htmlFor="loginPassword">
                Password
              </label>

              <div className={styles.passwordWrapper}>

              <input
              id="loginPassword"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              />

                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />
                  }
                </button>

              </div>

            </div>

            <button
    type="submit"
    className={styles.submitButton}
    disabled={loading}
>
    {loading ? "Signing in..." : "Sign in"}
</button>

{error && (
    <p className={styles.errorMessage} role="alert">
        {error}
    </p>
)}

          </form>

          <p className={styles.registerText}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onRegister}
            >
              Create account
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

export default Login;
