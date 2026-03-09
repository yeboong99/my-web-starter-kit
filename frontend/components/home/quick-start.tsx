import { CodeBlock } from "@/components/ui/code-block";
import { Separator } from "@/components/ui/separator";

const steps = [
  {
    step: "1",
    title: "환경변수 설정",
    code: "cp .env.default .env",
    lang: "bash",
  },
  {
    step: "2",
    title: "로컬 HTTPS 인증서 생성 (최초 1회)",
    code: "mkcert -install && make certs",
    lang: "bash",
  },
  {
    step: "3",
    title: "전체 스택 실행",
    code: "make up",
    lang: "bash",
  },
];

export function QuickStart() {
  return (
    <section className="py-12">
      <Separator className="mb-12" />
      <h2 className="text-2xl font-bold mb-2">빠른 시작</h2>
      <p className="text-muted-foreground mb-8">3단계로 전체 스택을 실행하세요.</p>
      <div className="flex flex-col gap-6">
        {steps.map(({ step, title, code, lang }) => (
          <div key={step} className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {step}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <p className="font-medium pt-1">{title}</p>
              <CodeBlock code={code} language={lang} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
