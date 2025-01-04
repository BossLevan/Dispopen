import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
} from "react";
import { useStorageState } from "../hooks/useStorageState";
import { useLogin, usePrivy } from "@privy-io/expo";
import { useRouter } from "expo-router";

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  isPrivyLoading: boolean;
  signInPrivy?: string | null;
  setSession: () => void;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  isPrivyLoading: false,
  signInPrivy: null,
  setSession: () => null,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const { login } = useLogin();
  const { logout } = usePrivy();
  const router = useRouter();

  const [[isLoading, session], setSession] = useStorageState("session");
  // Local state for `signInPrivy`
  const [[isPrivyLoading, signInPrivy], setSignInPrivy] =
    useStorageState("privy");
  const [[hasSeenIntroLoading, hasSeenIntro], setHasSeenIntro] =
    useStorageState("hasSeenIntro");

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          login({ loginMethods: ["email"] })
            .then((session) => {
              console.log("User logged in", session.user);
              setSignInPrivy("true");
              //handle errors
            })
            .catch((e) => console.log(e));
        },
        signOut: () => {
          logout();
          setSession(null);
          setSignInPrivy(null);
          setHasSeenIntro(null);
        },
        session,
        isLoading,
        signInPrivy,
        isPrivyLoading,
        setSession: () => {
          setSession("xxx");
          console.log("session set");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
