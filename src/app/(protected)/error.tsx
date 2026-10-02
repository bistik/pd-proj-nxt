"use client";

export default function ProtectedErrorPage({
  error,
  retry,
  message = "Something went wrong while loading the page.",
}: {
  error: Error & { digest?: string };
  retry: () => void;
  message?: string;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl">Something went wrong</h2>
      <p>{message}</p>
      {error.digest && (
        <p className="text-sm text-gray-500">Reference code: {error.digest}</p>
      )}
      <button
        onClick={() => retry()}
        className="underline text-blue-600 hover:text-blue-800 hover:cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
