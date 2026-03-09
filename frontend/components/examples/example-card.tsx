import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExampleCardProps {
  title: string;
  description: string;
  category: string;
  onClick: () => void;
}

export function ExampleCard({ title, description, category, onClick }: ExampleCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
