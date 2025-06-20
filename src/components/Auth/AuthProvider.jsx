import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

export function AuthProvider({ children }) {
  const { initializeAuth, isInitialized } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize auth state from localStorage when app starts
        initializeAuth();
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [initializeAuth]);

  // Show loading while auth is being initialized
  if (isLoading || !isInitialized) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return children;
}
