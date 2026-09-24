import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="border-b border-border bg-surface">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4 sm:px-8">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          Dev Study Lab
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/entrevista"
            className="text-base font-medium text-muted-foreground hover:text-foreground"
          >
            Entrevista
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
