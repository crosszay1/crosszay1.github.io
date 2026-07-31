export default function Terminal() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-6">
      <h1>SCI-FI TERMINAL v1.0</h1>

      <p>Welcome aboard.</p>

      <div className="mt-4">
        <span>&gt; </span>
        <span className="animate-pulse">█</span>
      </div>
    </div>
  );
}