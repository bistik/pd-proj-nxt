import Link from "next/link";

export default function ProtectedNotFoundPage() {
  return (
    <div>
      <h2 className="text-2xl">404</h2>
      <p>Item is not found</p>
      <Link
        href={"/"}
        className="text-blue-600 underline hover:text-blue-800 hover:cursor-pointer"
      >
        Go to homepage
      </Link>
    </div>
  );
}
