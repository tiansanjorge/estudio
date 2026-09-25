import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-8">
      <Link
        href="/"
        className="block text-center text-base font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
      >
        Dev Study Lab
      </Link>
    </footer>
  );
}
