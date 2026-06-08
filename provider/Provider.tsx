import { ReactNode } from "react";
import AuthProvider from "./AuthProvider";
import { getAccesstoken, getCurrentUser } from "@/service/authService";
import SocketProvider from "./SocketProvider";
import MobileDragDropProvider from "./MobileDragDropProvider";

const Provider = async ({ children }: { children: ReactNode }) => {
  const [currentUser, token] = await Promise.all([
    getCurrentUser(),
    getAccesstoken(),
  ]);
  const isLoggedIn = !!currentUser;

  return (
    <AuthProvider>
      <SocketProvider
        enabled={isLoggedIn}
        tenantSlug={currentUser?.tenantSlug || ""}
        token={token || ""}
      >
        <MobileDragDropProvider>
          {children}
        </MobileDragDropProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default Provider;
