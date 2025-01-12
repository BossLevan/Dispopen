import { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import { useSession } from "@/components/ctx";

//i initialized the session in the home page ...
export function useNavigationLogic(
  session: any, 
  isLoading: boolean, 
  signInPrivy: any,
  isPrivyLoading?: boolean | null,

) {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Exit if still loading or display name visit status is undetermined
    if (isPrivyLoading) return;

    const currentPath = segments.join("/");


    // Authentication Flow
    if (!session && signInPrivy) { //first time
        router.replace("/(auth)/(home)/home");
        return
      // Authenticated user flow
    } 
    if(!session && !signInPrivy){
      // Not authenticated
      if (currentPath !== "index") {
        console.log("Not authenticated: Redirecting to login");
        router.replace(`/login`);
        return;
      }
    } else if (session && signInPrivy){
        router.replace("/(auth)/(home)/home");
        return
    } else if(!session) {
        //handle any other condition
        router.replace(`/login`);
        return
    }
  }, [signInPrivy, session, router]);
}
