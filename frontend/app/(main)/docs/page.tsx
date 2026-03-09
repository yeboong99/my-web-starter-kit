import { PageHeader } from "@/components/layout/page-header";
import { DocSection } from "@/components/docs/doc-section";
import { DocSidebar } from "@/components/docs/doc-sidebar";
import { CodeBlock } from "@/components/ui/code-block";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DocsPage() {
  return (
    <>
      <PageHeader
        title="문서"
        description="스타터킷 설정, 구조, 아키텍처 핵심 요약."
        crumbs={[{ label: "Docs" }]}
      />

      <div className="flex gap-8">
        {/* 사이드바 */}
        <aside className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-20">
            <DocSidebar />
          </div>
        </aside>

        {/* 콘텐츠 */}
        <div className="flex-1 flex flex-col gap-12 min-w-0">

          <DocSection id="getting-started" title="시작하기">
            <div className="flex flex-col gap-2">
              <p className="font-medium">사전 요구사항</p>
              <div className="flex flex-wrap gap-2">
                {["Docker Desktop", "mkcert", "GNU Make", "pnpm (선택)"].map((req) => (
                  <Badge key={req} variant="outline">{req}</Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-medium">초기 설정</p>
              <CodeBlock code="cp .env.default .env" language="bash" />
              <p className="text-muted-foreground text-xs">`.env` 파일을 편집하여 필요한 환경변수를 설정하세요.</p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-medium">로컬 HTTPS 인증서 (최초 1회)</p>
              <CodeBlock code="mkcert -install && make certs" language="bash" />
              <p className="text-muted-foreground text-xs">`certs/` 디렉토리에 `localhost.pem`, `localhost-key.pem`이 생성됩니다.</p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-medium">전체 스택 실행</p>
              <CodeBlock code="make up" language="bash" />
              <p className="text-muted-foreground text-xs">실행 후 <strong>https://localhost</strong> 에서 확인하세요.</p>
            </div>
          </DocSection>

          <DocSection id="structure" title="프로젝트 구조">
            <CodeBlock
              language="plaintext"
              code={`my-web-starter-kit/
├── frontend/          # Next.js 16 앱
│   ├── app/           # App Router 페이지
│   ├── components/    # UI 컴포넌트
│   └── lib/           # 유틸리티, Provider
├── backend/           # Spring Boot 4 앱
│   └── src/main/java/
├── nginx/
│   └── default.conf   # 리버스 프록시 + SSL 설정
├── certs/             # mkcert 인증서 (gitignore)
├── docker-compose.yml # 전체 스택 정의
├── Makefile           # 개발 명령어
└── .env               # 환경변수 (.env.default 복사)`}
            />
          </DocSection>

          <DocSection id="architecture" title="아키텍처">
            <p>브라우저 요청은 nginx를 통해 적절한 서비스로 라우팅됩니다.</p>

            <CodeBlock
              language="plaintext"
              code={`브라우저
    │
    ▼ HTTPS (443)
┌─────────┐
│  nginx  │  ← SSL 종료, 리버스 프록시
└─────────┘
    │              │
    ▼ /*           ▼ /api/*
┌──────────┐   ┌──────────┐
│ frontend │   │ backend  │
│ :3000    │   │ :8080    │
└──────────┘   └──────────┘
                   │         │
                   ▼         ▼
             ┌──────────┐ ┌───────┐
             │ postgres │ │ redis │
             │ :5432    │ │ :6379 │
             └──────────┘ └───────┘`}
            />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>서비스</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead>포트</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["nginx", "SSL 종료, 리버스 프록시, 정적 파일", "80, 443 (외부)"],
                  ["frontend", "Next.js App Router SSR/CSR", "3000 (내부)"],
                  ["backend", "Spring Boot REST API", "8080 (내부)"],
                  ["postgres", "관계형 데이터베이스", "5432 (내부)"],
                  ["redis", "캐시, 세션", "6379 (내부)"],
                ].map(([service, role, port]) => (
                  <TableRow key={service}>
                    <TableCell className="font-mono">{service}</TableCell>
                    <TableCell>{role}</TableCell>
                    <TableCell className="font-mono text-xs">{port}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DocSection>

          <DocSection id="commands" title="주요 명령어">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>명령어</TableHead>
                  <TableHead>설명</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["make up", "전체 스택 빌드 + 실행 (백그라운드)"],
                  ["make down", "전체 스택 종료"],
                  ["make logs", "전체 로그 스트리밍"],
                  ["make clean", "컨테이너 + 볼륨 완전 삭제"],
                  ["make certs", "mkcert로 로컬 HTTPS 인증서 생성"],
                ].map(([cmd, desc]) => (
                  <TableRow key={cmd}>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">{cmd}</code>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DocSection>

        </div>
      </div>
    </>
  );
}
