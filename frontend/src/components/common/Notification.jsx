import { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import styles from "./Notification.module.css";

function Notification({ type = "success", message, onClose, duration = 3000 }) {
    useEffect(() => {
        if (!message || duration <= 0) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    const isSuccess = type === "success";

    return (
        <div
            className={`${styles.notification} ${
                isSuccess ? styles.success : styles.error
            }`}
            role={isSuccess ? "status" : "alert"}
        >
            <div className={styles.message}>
                {isSuccess ? (
                    <CheckCircle size={20} />
                ) : (
                    <AlertCircle size={20} />
                )}

                <span>{message}</span>
            </div>

            <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close notification"
            >
                <X size={18} />
            </button>
        </div>
    );
}

export default Notification;