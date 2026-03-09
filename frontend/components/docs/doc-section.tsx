import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";

interface DocSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function DocSection({ id, title, children }: DocSectionProps) {
  return (
    <section id={id} className="flex flex-col gap-4 scroll-mt-20">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <Separator className="mt-3" />
      </div>
      <div className="flex flex-col gap-3 text-sm text-foreground/90 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
