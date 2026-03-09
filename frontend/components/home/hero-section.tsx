import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Activity } from "lucide-react";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center gap-6 py-16 md:py-24">
      <Badge variant="secondary" className="gap-1.5">
        <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
        Docker 풀스택 + 로컬 HTTPS 사전 구성
      </Badge>

      <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
        Spring Boot + Next.js
        <br />
        <span className="text-primary">Web Starter Kit</span>
      </h1>

      <p className="text-lg text-muted-foreground max-w-xl">
        새 프로젝트를 빠르게 시작하기 위한 풀스택 기반 구조.
        Docker Compose 한 명령어로 전체 스택을 실행하세요.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild size="lg">
          <Link href="/examples">
            예제 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/status">
            <Activity className="mr-2 h-4 w-4" />
            시스템 상태
          </Link>
        </Button>
      </div>
    </section>
  );
}
