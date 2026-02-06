import Link from "next/link";
import { Button } from "@/components/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full flex-1 flex-col items-center justify-center px-2 py-20 text-center sm:px-4 md:px-8">
      <h1 className="font-bold text-[8rem] text-[var(--accent)] leading-none sm:text-[10rem]">
        404
      </h1>
      <h2 className="mt-4 font-semibold text-2xl text-[var(--foreground)] sm:text-3xl">
        Page Not Found
      </h2>
      <p className="mt-3 text-[var(--muted-foreground)]">
        გვერდი, რომელსაც ეძებთ, არ არსებობს ან გადატანილია.
      </p>
      <Link href="/" className="mt-8">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
