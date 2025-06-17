import { useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

export function AuthProvider({ children }) {
  const { initFromStorage } = useAuthStore();

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  return children;
}
