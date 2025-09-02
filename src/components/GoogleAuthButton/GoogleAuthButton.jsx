"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { authService } from "@/src/services/client";
import "./GoogleAuthButton.scss";

export default function GoogleAuthButton({ onSuccess, onError }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const btnHostRef = useRef(null);
  const initedRef = useRef(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const endpoint = `${apiBase}/auth/verify-token`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    const ensureScript = () =>
      new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) return resolve();
        const src = "https://accounts.google.com/gsi/client";
        let tag = document.querySelector(`script[src="${src}"]`);
        if (!tag) {
          tag = document.createElement("script");
          tag.src = src;
          tag.async = true;
          tag.defer = true;
          document.head.appendChild(tag);
        }
        tag.addEventListener("load", () => resolve(), { once: true });
        tag.addEventListener(
          "error",
          () => reject(new Error("Failed to load GIS script")),
          { once: true }
        );
      });

    (async () => {
      try {
        await ensureScript();
        if (cancelled) return;
        if (!clientId) throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID не задан");

        if (!initedRef.current) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCodeResponse,
          });
          initedRef.current = true;
        }

        if (btnHostRef.current) {
          window.google.accounts.id.renderButton(btnHostRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            shape: "pill",
          });
        }

        window.google.accounts.id.prompt(); // опционально, для One Tap
        setReady(true);
      } catch (err) {
        console.error("[Google OAuth] init error:", err);
        setReady(false);
        onError?.(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCodeResponse = useCallback(
    async (resp) => {
      if (!resp || resp.error) {
        const err = new Error(
          resp?.error_description || resp?.error || "Вход отменён"
        );
        onError?.(err);
        setLoading(false);
        return;
      }
      const id_token = resp.credential;
      if (!id_token) {
        onError?.(new Error("Не получен ID token"));
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Authorization: `Bearer ${id_token}` },
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || `Exchange failed (${res.status})`);
        }
        if (data.data?.user) authService.setUserData(data.data.user);
        onSuccess?.({ user: data.data?.user, raw: data });
      } catch (e) {
        console.error("[Google OAuth] exchange error:", e);
        onError?.(e);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, onError, onSuccess]
  );

  return (
    <div className="GoogleAuthButtonWrapper" aria-busy={loading || undefined}>
      <div ref={btnHostRef} />
    </div>
  );
}
