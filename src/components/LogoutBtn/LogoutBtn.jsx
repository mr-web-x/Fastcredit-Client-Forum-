"use client";

import "./LogoutBtn.scss";
import { logoutAction } from "@/app/actions/auth";
import LogoutIcon from "@mui/icons-material/Logout";

const LogoutBtn = () => {
  return (
    <form action={logoutAction} className="logout-form">
      <button type="submit" className="LogoutBtn">
        <LogoutIcon />
        <span>Odhlásiť sa</span>
      </button>
    </form>
  );
};

export default LogoutBtn;
