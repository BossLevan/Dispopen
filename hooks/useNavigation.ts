import { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import * as Storage from "@/utils/storage_visit_name";
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

//   useEffect(() => {
//     // Exit if still loading or display name visit status is undetermined
//     if (isLoading || hasVisitedDisplayName === null) return;

//     const currentPath = segments.join("/");
//     const inAuthGroup = segments[0] === "(auth)";
//     const inDisplayNamePage = segments[1] === "display_name";


//     // Authentication Flow
//     if (session) {
//         console.log(hasVisitedDisplayName)
//       // First-time display name setup
//       if (!inDisplayNamePage) {
//         console.log("First-time user: Redirecting to display name");
//         router.replace("/(auth)/display_name");

//         return;
//       }

//       // Authenticated user flow
//       if (hasVisitedDisplayName && currentPath !== "(auth)/(home)/home") {
//         console.log("Authenticated: Redirecting to home");
//         router.replace("/(auth)/(home)/home");
//         return;
//       }
//     } else {
//       // Not authenticated
//       if (currentPath !== "login") {
//         console.log("Not authenticated: Redirecting to login");
//         router.replace("/login");
//         Storage.Storage.setItem("hasVisitedDisplayName", "false");
//         return;
//       }
//     }
//   }, [session, isLoading, hasVisitedDisplayName]);




  useEffect(() => {
    // Exit if still loading or display name visit status is undetermined
    if (isPrivyLoading) return;

    const currentPath = segments.join("/");
    const inAuthGroup = segments[0] === "(auth)";
    const inDisplayNamePage = segments[1] === "display_name";


    // Authentication Flow
    if (!session && signInPrivy) { //first time
        router.replace("/(auth)/(home)/home");
        return
      // Authenticated user flow
    } 
    if(!session && !signInPrivy){
      // Not authenticated
      if (currentPath !== "login") {
        console.log("Not authenticated: Redirecting to login");
        router.replace("/login");
        return;
      }
    } else if (session && signInPrivy){
        router.replace("/(auth)/(home)/home");
        return
    } else {
        //handle any other condition
        router.replace("/login");
    }
  }, [signInPrivy, isPrivyLoading]);
}
