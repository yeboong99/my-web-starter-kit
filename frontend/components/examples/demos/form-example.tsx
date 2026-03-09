"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
  email: z.string().email("올바른 이메일 주소를 입력하세요."),
  role: z.string().min(1, "역할을 선택하세요."),
  agree: z.boolean().refine((v) => v, "약관에 동의해야 합니다."),
  newsletter: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function FormExample() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { agree: false, newsletter: false, role: "" },
  });

  function onSubmit(data: FormValues) {
    toast.success(`제출 완료: ${data.name} (${data.role})`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">이름</Label>
        <Input id="name" placeholder="홍길동" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input id="email" type="email" placeholder="user@example.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>역할</Label>
        <Select onValueChange={(v) => setValue("role", v)}>
          <SelectTrigger>
            <SelectValue placeholder="역할 선택..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frontend">프론트엔드</SelectItem>
            <SelectItem value="backend">백엔드</SelectItem>
            <SelectItem value="fullstack">풀스택</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="newsletter"
          checked={watch("newsletter")}
          onCheckedChange={(v) => setValue("newsletter", v)}
        />
        <Label htmlFor="newsletter">뉴스레터 수신</Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="agree"
          checked={watch("agree")}
          onCheckedChange={(v) => setValue("agree", Boolean(v))}
        />
        <Label htmlFor="agree">이용약관에 동의합니다</Label>
      </div>
      {errors.agree && <p className="text-xs text-destructive">{errors.agree.message}</p>}

      <Button type="submit" className="mt-2">제출</Button>
    </form>
  );
}
