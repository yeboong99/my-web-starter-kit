"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/ui/code-block";
import type { ReactNode } from "react";

interface ExampleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  demo: ReactNode;
  code: string;
}

export function ExampleModal({ open, onOpenChange, title, description, demo, code }: ExampleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="demo">
          <TabsList>
            <TabsTrigger value="demo">데모</TabsTrigger>
            <TabsTrigger value="code">코드</TabsTrigger>
          </TabsList>
          <TabsContent value="demo" className="mt-4">
            {demo}
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <CodeBlock code={code} language="tsx" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
