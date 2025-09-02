"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { authService } from "@/src/services/client";
import "./GoogleAuthButton.scss";

export default function GoogleAuthButton({ onSuccess, onError }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const clientRef = useRef(null);
  const initedRef = useRef(false);
  const focusGuardTimerRef = useRef(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = `${apiBase}/auth/google/exchange-code`;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    const ensureScript = () =>
      new Promise((resolve, reject) => {
        if (window.google?.accounts?.oauth2) {
          resolve();
          return;
        }
        const src = "https://accounts.google.com/gsi/client";
        let tag = document.querySelector(`script[src="${src}"]`);
        if (!tag) {
          tag = document.createElement("script");
          tag.src = src;
          tag.async = true;
          tag.defer = true;
          document.head.appendChild(tag);
        }
        const onLoad = () => resolve();
        const onError = () => reject(new Error("Failed to load GIS script"));
        tag.addEventListener("load", onLoad, { once: true });
        tag.addEventListener("error", onError, { once: true });
      });

    (async () => {
      try {
        await ensureScript();
        if (cancelled) return;

        if (!clientId) {
          throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID не задан");
        }
        if (!initedRef.current) {
          clientRef.current = window.google.accounts.oauth2.initCodeClient({
            client_id: clientId,
            scope: "openid email profile",
            ux_mode: "popup",
            callback: (resp) => handleCodeResponse(resp),
          });
          initedRef.current = true;
        }
        setReady(true);
      } catch (err) {
        console.error("[Google OAuth] init error:", err);
        setReady(false);
        onError && onError(err);
      }
    })();

    return () => {
      cancelled = true;
      if (focusGuardTimerRef.current) {
        clearTimeout(focusGuardTimerRef.current);
        focusGuardTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCodeResponse = useCallback(
    async (resp) => {
      // Попап закрыт/ничего не вернули — обязательно разблокируем кнопку
      if (!resp) {
        setLoading(false);
        onError && onError(new Error("Вход через Google отменён"));
        return;
      }

      // Ошибки GIS (popup_closed, access_denied и т.д.)
      if (resp.error) {
        const err = new Error(resp.error_description || resp.error);
        onError && onError(err);
        setLoading(false);
        return;
      }

      const code = resp.code;
      if (!code) {
        onError && onError(new Error("Не получен authorization_code"));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ code }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.success) {
          const message = data?.message || `Exchange failed (${res.status})`;
          throw new Error(message);
        }

        if (data.data?.user) {
          authService.setUserData(data.data.user);
        }
        onSuccess && onSuccess({ user: data.data?.user, raw: data });
      } catch (e) {
        console.error("[Google OAuth] exchange error:", e);
        onError && onError(e);
      } finally {
        setLoading(false); // <- всегда отпускаем кнопку
      }
    },
    [endpoint, onError, onSuccess]
  );

  const handleClick = useCallback(() => {
    if (!ready || !clientRef.current || loading) return;

    try {
      setLoading(true);

      // «Страховка» на случай, если попап закроют и колбэк не придёт.
      const onFocus = () => {
        if (focusGuardTimerRef.current)
          clearTimeout(focusGuardTimerRef.current);
        focusGuardTimerRef.current = setTimeout(() => {
          setLoading(false);
          focusGuardTimerRef.current = null;
        }, 2000);
        window.removeEventListener("focus", onFocus);
      };
      window.addEventListener("focus", onFocus, { once: true });

      clientRef.current.requestCode();
    } catch (e) {
      setLoading(false);
      onError && onError(e);
    }
  }, [ready, loading, onError]);

  const isDisabled = loading || !ready;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="GoogleAuthButton"
      disabled={isDisabled}
      aria-busy={loading || undefined}
    >
      <span className="GoogleAuthButton__icon" aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M44.5 20H24v8.5h11.8C34.9 32.9 30.2 36 24 36c-8 0-14.5-6.5-14.5-14.5S16 7 24 7c3.7 0 7.1 1.3 9.8 3.8l6-6C35.7 1.7 30.2 0 24 0 10.7 0 0 10.7 0 24s10.7 24 24 24c12.4 0 23-9 23-24 0-1.3-.2-2.7-.5-4z"
            fill="#FFC107"
          />
          <path
            d="M2.8 14.7l7 5.1C11.7 15.4 17.3 12 24 12c3.7 0 7.1 1.3 9.8 3.8l6-6C35.7 1.7 30.2 0 24 0 15 0 7.1 5.2 2.8 14.7z"
            fill="#FF3D00"
          />
          <path
            d="M24 48c6.1 0 11.8-2.3 16-6.2l-7.4-6c-2.2 1.7-5.1 2.7-8.6 2.7-6.2 0-11.5-4.2-13.4-9.9l-7.1 5.5C7 42.8 14.8 48 24 48z"
            fill="#4CAF50"
          />
          <path
            d="M44.5 20H24v8.5h11.8c-1.1 3.2-3.5 5.8-7.3 7.3l7.4 6C40.9 38.7 47 33.6 47 24c0-1.3-.2-2.7-.5-4z"
            fill="#1976D2"
          />
        </svg>
      </span>
      <span className="GoogleAuthButton__label">
        {loading ? "Pripájanie k službe Google…" : "Prihlásiť sa cez Google"}
      </span>
    </button>
  );
}
