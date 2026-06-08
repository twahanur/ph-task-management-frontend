"use client";
import { getCurrentUser } from "@/service/authService";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export type TCurrentUser = {
  userId: 1;
  tenantSlug: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
};

type exportProviderValue = {
  user: TCurrentUser | null;
  isLoading: boolean;
  setUser: (user: TCurrentUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<exportProviderValue | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TCurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) return;
    Promise.resolve().then(() => {
      handleUser();
    });
  }, [isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        refetchUser: handleUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("something went wrong");
  }
  return context;
};

export default AuthProvider;
