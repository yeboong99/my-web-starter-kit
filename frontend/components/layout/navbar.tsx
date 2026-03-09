"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/examples", label: "Examples" },
  { href: "/docs", label: "Docs" },
  { href: "/status", label: "Status" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
        {/* 로고 */}
        <Link href="/" className="mr-8 flex items-center gap-2 font-semibold">
          <span className="text-primary">⬡</span>
          <span>Starter Kit</span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors hover:text-foreground hover:bg-accent",
                pathname === href
                  ? "text-foreground font-medium bg-accent"
                  : "text-muted-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* 우측 */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {/* 모바일 메뉴 */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>메뉴</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent",
                      pathname === href
                        ? "font-medium bg-accent"
                        : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
