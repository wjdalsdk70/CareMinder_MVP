import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { refresh as apiRefresh } from "src/lib/api";
import useLocalStorage from "./useLocalStorage";

const STORAGE_KEY = "session";
const defaultModel = { user: null, accessToken: null, refreshToken: null };

export default function useSession() {
  const [session, setSession] = useLocalStorage(STORAGE_KEY, defaultModel);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (session.user) {
      try {
        const { exp } = jwtDecode(session.refreshToken);
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(exp);
        const now = new Date();
        setSession(now >= expirationDate ? defaultModel : session);
      } catch (e) {
        console.error(e);
      }
    }
    setReady(true);
  }, [session]);

  function login(value) {
    setSession(value);
  }

  function logout() {
    setSession(defaultModel);
  }

  return {
    ...session,
    ready,
    login,
    logout,
  };
}

export function useRedirectToLogin(session, url) {
  const navigate = useNavigate();

  useEffect(() => {
    if (session.ready && !session.user) navigate(url);
  }, [session, navigate]);
}

export function useRedirectToHome(session, url) {
  const navigate = useNavigate();

  useEffect(() => {
    if (session.ready && session.user) navigate(url);
  }, [session, navigate]);
}
