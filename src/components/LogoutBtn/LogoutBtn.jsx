"use client";

import "./LogoutBtn.scss";
import { logoutAction } from "@/app/actions/auth";
import LogoutIcon from "@mui/icons-material/Logout";

const LogoutBtn = () => {
  const handleLogout = async () => {
    try {
      await logoutAction();
      // logoutAction уже делает redirect и очищает cookie
    } catch (error) {
      // В случае ошибки пытаемся сделать fallback через Route Handler
      try {
        const response = await fetch(`/forum/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          window.location.href = "/forum";
        }
      } catch (fallbackError) {
        console.error("[Header] Fallback logout failed:", fallbackError);
        // Последний fallback - просто редирект
        window.location.href = `/forum/login`;
      }
    }
  };
  return (
    <button onClick={handleLogout} className="LogoutBtn">
      <LogoutIcon />
      <span>Odhlásiť sa</span>
    </button>
  );
};

export default LogoutBtn;
