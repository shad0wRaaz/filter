"use client";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/router";

const useActivityListener = () => {
  const { data: session } = useSession();
  // const router = useRouter();

  useEffect(() => {
    if (!session) return;

    const events = ["mousemove", "keydown", "scroll", "resize"];
    let timeoutId;

    const updateActivity = async () => {
      await fetch("/api/auth/session?update"); // Update the session
    };

    const handleActivity = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateActivity, 5000); // Update activity after 5 seconds of inactivity
    };

    events.forEach(event => window.addEventListener(event, handleActivity));

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearTimeout(timeoutId);
    };
  }, [session]);

  // useEffect(() => {
  //   if (!session) {
  //     router.push("/auth/signin"); // Redirect to login page if session is null
  //   }
  // }, [session, router]);
};

export default useActivityListener; 