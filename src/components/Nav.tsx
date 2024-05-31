"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import ThemeToggle from "./ThemeToggle";
import { ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import MemeMartIcon from "../app/favicon.ico";
import { Fredoka } from "next/font/google";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const fredoka = Fredoka({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Nav({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <nav className=" bg-primary-foreground text-secondary-foreground flex justify-around px-5 sm:px-0">
      {/* <ThemeToggle /> */}
      <MemeMartLogo />
      <div className="flex justify-center px-4">{children}</div>
      <div className=" flex items-center">
        <Link href="/cart">
          <ShoppingCartIcon />
        </Link>
      </div>
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

export function MemeMartLogo() {
  const router = useRouter();
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        className="flex items-center"
        onClick={() => router.push("/")}
      >
        <span className={`${fredoka.className} font-bold sm:block hidden`}>
          Meme Mart
        </span>
        <Image src={MemeMartIcon} height={32} width={32} alt="logo" />
      </Button>
    </div>
  );
}
