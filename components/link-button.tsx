import { cn } from "@/lib/utils";
import Link from "next/link";

type LinkButtonProps = {
  href: string;
  isActiveLink: (path: string) => boolean;
  children: React.ReactNode;
};

export default function LinkButton({ href, isActiveLink, children }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "w-full flex items-center justify-start gap-2 px-4 py-1.5 rounded-lg transition-colors",
        "hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary",
        isActiveLink(href) ? "bg-gray-500/15 dark:bg-primary/10 dark:text-white" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
}