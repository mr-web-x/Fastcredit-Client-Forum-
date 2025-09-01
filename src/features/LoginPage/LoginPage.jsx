"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/src/services/client";
import { basePath } from "@/src/constants/config";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [login, setLogin] = useState(""); // email или username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // если уже авторизован на клиенте — уводим
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.replace(searchParams.get("next") || `${basePath}/`);
    }
  }, [router, searchParams]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await authService.login({ login, password });
      // если API вернул пользователя — сохраним локально (не критично)
      if (res?.user) authService.setUserData(res.user);

      // редирект: ?next=/forum/xxx или на главную форума
      const next = searchParams.get("next") || `${basePath}/`;
      router.replace(next);
    } catch (error) {
      setErr(error?.message || "Nepodarilo sa prihlásiť");
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ padding: "48px 0" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <h1 style={{ marginBottom: 16 }}>Prihlásenie</h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          Zadajte svoj e-mail alebo používateľské meno a heslo.
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Login (e-mail alebo používateľské meno)</span>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="napr. jan@domena.sk"
              required
              disabled={loading}
              style={{ padding: "10px 12px" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Heslo</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              style={{ padding: "10px 12px" }}
            />
          </label>

          {err && <div style={{ color: "#c00", fontSize: 14 }}>{err}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn"
            style={{ padding: "10px 14px" }}
          >
            {loading ? "Prihlasovanie…" : "Prihlásiť sa"}
          </button>

          <div style={{ marginTop: 8, fontSize: 14 }}>
            <a href={`${basePath}/register`} className="btn btn--secondary">
              Nemáte účet? Registrácia
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
