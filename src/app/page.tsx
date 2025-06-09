"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Transcribe from "@/components/Transcribe";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  if (!session) return null; // or a loading spinner

  return (
    <div>
      <Transcribe name={session.user?.name}   email={session.user?.email} id={session.user?.image} />
      {/* Your page content */}
    </div>
  );
}
