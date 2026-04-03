import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-7xl mb-6">🚌</div>
      <h1 className="font-display font-bold text-4xl text-white mb-3">404 — Page Not Found</h1>
      <p className="text-slate-400 mb-8 max-w-md">
        The page you're looking for doesn't exist. It may have moved, or you may have typed the wrong address.
      </p>
      <Link href="/" className="btn-primary px-8 py-3 rounded-2xl text-base">
        ← Go to Homepage
      </Link>
    </div>
  );
}
