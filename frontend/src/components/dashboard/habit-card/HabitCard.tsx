import { forwardRef } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  emoji?: string;
  done: boolean;
  children?: React.ReactNode;
}

export const HabitCard = forwardRef<HTMLDivElement, HabitCardProps>(
  ({ name, emoji, done, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-full flex items-center gap-4 rounded-[16px] px-5 py-4", className)}
      {...props}
    >
      <span className="shrink-0">
        {done
          ? <CheckCircle2 className="h-5 w-5 text-primary" />
          : <Circle className="h-5 w-5 text-muted-foreground" />}
      </span>

      <span className="flex-1 min-w-0">
        <p className={cn("font-medium text-sm truncate", done ? "text-primary line-through" : "text-foreground")}>
          {emoji && <span className="mr-1.5">{emoji}</span>}
          {name}
        </p>
      </span>
      {children}
    </div>
  )
);

HabitCard.displayName = "HabitCard";
