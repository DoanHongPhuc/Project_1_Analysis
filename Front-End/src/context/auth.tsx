import { createContext } from "react";
import { useContext } from "react";
import { useCallback } from "react";
import { useState } from "react";

type AuthContextType = {
  userId: string | null;
  user_name: string | null;
  user_email: string | null;
  role: string | null;
  std_email: string | null;
  updateUserInfo: (
    userId: number | null,
    user_name: string | null,
    user_email: string | null,
    role: number | null
  ) => void;
  updateStuEmail: (user_email: string | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  user_name: null,
  user_email: null,
  role: null,
  std_email: null,
  updateUserInfo: () => {},
  updateStuEmail: () => {},
});

export const useAuth = () => useContext(AuthContext);

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [userId, setUserId] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("userId") : null
  );
  const [user_name, setUserName] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("user_name") : null
  );
  const [user_email, setUserEmail] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("user_email") : null
  );
  const [role, setRole] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("role") : null
  );
  const [std_email, setStuEmail] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("std_email") : null
  );

  const updateUserInfo = useCallback(
    (
      userId: number | null,
      user_name: string | null,
      user_email: string | null,
      role: number | null
    ) => {
      const userIdString = userId ? userId.toString() : "";
      const roleString = role ? role.toString() : "";
      localStorage.setItem("userId", userIdString);
      localStorage.setItem("user_name", user_name ?? "");
      localStorage.setItem("user_email", user_email ?? "");
      localStorage.setItem("role", roleString ?? "");
      setUserId(userIdString);
      setUserName(user_name);
      setUserEmail(user_email);
      setRole(roleString);
    },
    []
  );
  const updateStuEmail = useCallback((std_email: string | null) => {
    setStuEmail(std_email);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userId,
        user_name,
        user_email,
        role,
        std_email,
        updateUserInfo,
        updateStuEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
