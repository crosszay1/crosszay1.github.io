"use client";

import { sendRequest } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Terminal() {
  const [ip, setIp] = useState("Loading...");

  useEffect(() => {
    async function loadIp() {
      const data = await sendRequest("/api/ip");
      setIp(data.ip);
    }

    loadIp();
  }, []);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-6">
      <h1>test header</h1>

      <p>Welcome, {ip}</p>

      <div className="mt-4">
        <span>&gt; </span>
        <span className="animate-pulse">█</span>
      </div>
    </div>
  );
}