import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-auto">
      <Separator />
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} Web Starter Kit</span>
        <span>Spring Boot + Next.js + Docker</span>
      </div>
    </footer>
  );
}
