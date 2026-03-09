import { Card, CardContent } from "@/components/ui/card";

const stack = [
  { name: "Next.js 16", desc: "App Router, SSR/SSG, React 19", icon: "▲" },
  { name: "Spring Boot 4", desc: "Java 21, REST API, JPA", icon: "☕" },
  { name: "PostgreSQL 17", desc: "관계형 데이터베이스", icon: "🐘" },
  { name: "Redis 7", desc: "캐싱, 세션 관리", icon: "⚡" },
  { name: "Tailwind CSS v4", desc: "유틸리티 퍼스트 CSS", icon: "🎨" },
  { name: "shadcn/ui", desc: "재사용 가능한 UI 컴포넌트", icon: "◉" },
];

export function TechStackGrid() {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-center mb-8">기술 스택</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stack.map(({ name, desc, icon }) => (
          <Card key={name} className="transition-shadow hover:shadow-md">
            <CardContent className="pt-6 flex flex-col gap-2">
              <span className="text-2xl">{icon}</span>
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
