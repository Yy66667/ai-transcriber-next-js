// components/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-2 border-2 mb-6 text-sm rounded-md cursor-pointer "
    >
      Logout
    </button>
  );
}
