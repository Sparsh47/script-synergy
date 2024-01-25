"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { v4 as uuidV4 } from "uuid";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(`/documents/${uuidV4()}`);
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      ScriptSynergy
    </main>
  );
}
