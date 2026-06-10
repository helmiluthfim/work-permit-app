"use client";

import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center border-b bg-white px-6 py-4">
      <div>
        <h2 className="font-semibold">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <span>{session?.user?.username}</span>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded bg-red-600 px-3 py-2 text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
