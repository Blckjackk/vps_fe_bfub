"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CBTPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke halaman soal PG sebagai default
    router.push("/cbt/soal-pg");
  }, [router]);

  return null;
}