"use client";

import { useEffect, useRef, useState } from "react";
import { sendRequest } from "@/lib/api";

type BootLine =
  | { type: "text"; text: string; delay?: number }
  | { type: "bar"; label: string; duration?: number }

const [ip, setIp] = useState("Loading...");

  useEffect(() => {
    async function loadIp() {
      const data = await sendRequest("/api/ip");
      setIp(data.ip);
    }

    loadIp();
  }, []);

const text_sequence: BootLine[] = [
  { type: "text", text: "C-BIOS v0.0.1", delay: 300 }, //must switch to crosszay bios or something idk
  { type: "text", text: "", delay: 150 },
  { type: "bar", label: "Detecting hardware...", duration: 400 },
  { type: "bar", label: "Memory check", duration: 900 },
  { type: "bar", label: "Mounting /dev/nvme0", duration: 700 },
  { type: "text", text: "", delay: 150 },
  { type: "text", text: `Welcome ${ip}`, delay: 1000 },
];

interface BootProps {
  onComplete: () => void;
  sequence?: BootLine[];
}

export default function Boot({
  onComplete,
  sequence = text_sequence,
}: BootProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [typedText, setTypedText] = useState("");
  const [barPercent, setBarPercent] = useState<number | null>(null);
  const [barLabel, setBarLabel] = useState("");
  const [done, setDone] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    async function sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function typeLine(text: string) {
      for (let i = 0; i <= text.length; i++) {
        if (cancelled.current) return;
        setTypedText(text.slice(0, i));
        await sleep(30);
      }
    }

    async function runBar(label: string, duration: number) {
      setBarLabel(label);
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        if (cancelled.current) return;
        setBarPercent(Math.round((i / steps) * 100));
        await sleep(duration / steps);
      }
      await sleep(120);
      setBarPercent(null);
    }

    async function run() {
      for (const line of sequence) {
        if (cancelled.current) return;

        if (line.type === "text") {
          setTypedText("");
          await typeLine(line.text);
          setVisibleLines((prev) => [...prev, line.text]);
          setTypedText("");
          await sleep(line.delay ?? 200);
        } else {
          await runBar(line.label, line.duration ?? 800);
          setVisibleLines((prev) => [...prev, `${line.label} [OK]`]);
        }
      }

      if (!cancelled.current) {
        setDone(true);
        await sleep(500);
        if (!cancelled.current) onComplete();
      }
    }

    run();

    return () => {
      cancelled.current = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-6">
      {visibleLines.map((line, index) => (
        <pre key={index} className="m-0 whitespace-pre-wrap leading-tight">
          {line}
        </pre>
      ))}

      {!done && barPercent === null && (
        <pre className="m-0 whitespace-pre-wrap leading-tight">
          {typedText}
          <span className="animate-pulse">_</span>
        </pre>
      )}

      {!done && barPercent !== null && (
        <pre className="m-0 whitespace-pre-wrap leading-tight">
          {barLabel} [{"#".repeat(Math.round(barPercent / 5)).padEnd(20, "-")}]{" "}
          {barPercent}%
        </pre>
      )}
    </div>
  );
}