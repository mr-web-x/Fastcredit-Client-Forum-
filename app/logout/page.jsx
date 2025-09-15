"use client";

import { useEffect } from "react";
import { authService } from "@/src/services/client";
import { basePath } from "@/src/constants/config";

export default function LogoutPage() {
  useEffect(() => {
    (async () => {
      try {
        await authService.logout(); // внутри он редиректит на //login
      } catch {
        // на всякий — запасной редирект
        if (typeof window !== "undefined") {
          window.location.replace(`${basePath}login`);
        }
      }
    })();
  }, []);

  return (
    <main className="container" style={{ padding: "48px 0" }}>
      <h1 style={{ marginBottom: 8 }}>Odhlasovanie…</h1>
      <p>Prosím, čakajte.</p>
    </main>
  );
}
