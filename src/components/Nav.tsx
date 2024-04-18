"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Nav({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <nav className="bg-primary text-primary-foreground flex justify-center">
      <ThemeToggle />
      <div className="flex justify-center px-4">{children}</div>
    </nav>
  );
}

export function NavLink(props: ComponentProps<typeof Link>) {
  const pathName = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        pathName === props.href && "bg-background text-foreground"
      )}
    />
  );
}
