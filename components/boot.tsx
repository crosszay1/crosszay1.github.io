"use client";

import { useEffect, useRef, useState } from "react";
import { sendRequest } from "@/lib/api";

type BootLine =
  | { type: "text"; text: string; delay?: number }
  | { type: "bar"; label: string; duration?: number };

interface BootProps {
  onComplete: () => void;
  sequence?: BootLine[];
}

export default function Boot({ onComplete, sequence }: BootProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [typedText, setTypedText] = useState("");
  const [barPercent, setBarPercent] = useState<number | null>(null);
  const [barLabel, setBarLabel] = useState("");
  const [done, setDone] = useState(false);
  const cancelled = useRef(false);
  const skipped = useRef(false);
  const ip = useRef("Loading...");

  useEffect(() => {
    async function loadIp() {
      try {
        const data = await sendRequest("/api/ip");
        ip.current = data.ip;
      } catch {
        ip.current = "unknown";
      }
    }

    loadIp();
  }, []);

  // Listen for spacebar to skip the boot animation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        skipped.current = true;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const defaultSequence: BootLine[] = [
    { type: "text", text: "C-BIOS v0.0.1", delay: 300 }, //must switch to crosszay bios or something idk
    { type: "text", text: "", delay: 150 },
    { type: "bar", label: "Detecting hardware...", duration: 400 },
    { type: "bar", label: "Memory check", duration: 900 },
    { type: "bar", label: "Mounting /dev/nvme0", duration: 700 },
    { type: "text", text: "", delay: 150 },
    { type: "text", text: "Welcome {ip}", delay: 1000 },
  ];

  const activeSequence = sequence ?? defaultSequence;

  useEffect(() => {
    cancelled.current = false;

    async function sleep(ms: number) {
      if (skipped.current) return Promise.resolve();
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function typeLine(text: string) {
      if (skipped.current) {
        setTypedText(text);
        return;
      }
      for (let i = 0; i <= text.length; i++) {
        if (cancelled.current) return;
        if (skipped.current) {
          setTypedText(text);
          return;
        }
        setTypedText(text.slice(0, i));
        await sleep(30);
      }
    }

    async function runBar(label: string, duration: number) {
      setBarLabel(label);
      if (skipped.current) {
        setBarPercent(100);
        setBarPercent(null);
        return;
      }
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        if (cancelled.current) return;
        if (skipped.current) {
          setBarPercent(null);
          return;
        }
        setBarPercent(Math.round((i / steps) * 100));
        await sleep(duration / steps);
      }
      await sleep(120);
      setBarPercent(null);
    }

    async function run() {
      for (const line of activeSequence) {
        if (cancelled.current) return;

        if (line.type === "text") {
          const text = line.text.replace("{ip}", ip.current);
          setTypedText("");
          await typeLine(text);
          setVisibleLines((prev) => [...prev, text]);
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