import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Lock, Moon, Layers } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: Container,
    title: "Docker 풀스택",
    desc: "postgres, redis, backend, frontend, nginx를 한 명령어로 실행. 환경 차이 없음.",
  },
  {
    icon: Lock,
    title: "로컬 HTTPS",
    desc: "mkcert로 신뢰된 인증서 생성. 개발부터 프로덕션과 동일한 환경.",
  },
  {
    icon: Moon,
    title: "다크모드",
    desc: "next-themes 기반, 시스템 설정 자동 감지. FOUC 없는 부드러운 전환.",
  },
  {
    icon: Layers,
    title: "사전 구성 UI",
    desc: "shadcn/ui 컴포넌트 + react-query + react-hook-form + zod 즉시 사용 가능.",
  },
];

export function FeatureHighlights() {
  return (
    <section className="py-12">
      <Separator className="mb-12" />
      <h2 className="text-2xl font-bold text-center mb-8">주요 특징</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <Card key={title}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="h-4 w-4 text-primary" />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
