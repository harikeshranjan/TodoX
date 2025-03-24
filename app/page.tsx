"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session?.user ? (
        <p>Welcome, {session.user.username} </p>
      ) : (
        <p>Sign in to get started</p>
      )}
    </div>
  );
}
