"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function GoogleSignIn() {
  const {data: session, status} = useSession();

  useEffect(() => {
    async function handleSignIn() {
      if (!(status === "loading") && !session) {
        const res = await signIn("google", {callbackUrl: "/auth/error?="});
      }
      if (session) window.close();
    }

    handleSignIn();
  }, [session, status]);

  return (
    <div
        style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            left: 0,
            top: 0,
            background: "white",
        }}
    ></div>
  );
}