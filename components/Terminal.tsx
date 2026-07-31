export default function Terminal() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-6">
      <h1>test header </h1>

      <p>Message</p>

      <div className="mt-4">
        <span>&gt; </span>
        <span className="animate-pulse">█</span>
      </div>
    </div>
  );
}