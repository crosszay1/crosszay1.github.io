"use client";

import { sendRequest } from "@/lib/api";
import { commands } from "@/lib/commands";
import { useEffect, useState } from "react";

export default function Terminal() {
  const [ip, setIp] = useState("Loading...");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    async function loadIp() {
      const data = await sendRequest("/api/ip");
      setIp(data.ip);
    }

    loadIp();
  }, []);

  function runCommand() {
    const trimmed = input.trim();

    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const commandFunction = commands[commandName];

    let output: string;

    if (commandFunction) {
      output = commandFunction(args);
    } else {
      output = `Command not found: ${commandName}`;
    }

    const browserSafeOutput = output.replace(/\x1b\[[0-9;]*m/g, "");

    setHistory([...history, `> ${trimmed}`, browserSafeOutput]);

    setInput("");
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-6">
      <h1>Crosszay website thing v0.0.1</h1>

      <p>Welcome, {ip}</p>

      <div className="mt-4">
        {history.map((line, index) => (
          <pre key={index} className="m-0 whitespace-pre-wrap">
            {line}
          </pre>
        ))}

        <div className="flex">
          <span>{">"}</span>

          <input
            className="bg-transparent outline-none flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                runCommand();
              }
            }}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}