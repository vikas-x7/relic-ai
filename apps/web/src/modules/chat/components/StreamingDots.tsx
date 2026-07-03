export default function StreamingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-2">
      <span className="h-2 w-2 animate-pulse rounded-full bg-white/40" style={{ animationDelay: '0ms', animationDuration: '1.2s' }} />
      <span className="h-2 w-2 animate-pulse rounded-full bg-white/40" style={{ animationDelay: '200ms', animationDuration: '1.2s' }} />
      <span className="h-2 w-2 animate-pulse rounded-full bg-white/40" style={{ animationDelay: '400ms', animationDuration: '1.2s' }} />
    </span>
  );
}
