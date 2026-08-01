"use client";

import { useState } from "react";
import Boot from "@/components/boot";
import Terminal from "@/components/Terminal";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return booted ? <Terminal /> : <Boot onComplete={() => setBooted(true)} />;
}