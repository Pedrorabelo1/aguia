import { cn } from "@aguia/ui";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textClassName?: string;
}

const sizes = {
  sm: "h-6 w-auto",
  md: "h-8 w-auto",
  lg: "h-10 w-auto",
  xl: "h-14 w-auto",
};

export function AguiaLogo({
  className,
  size = "md",
  showText = true,
  textClassName,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 400 200"
        fill="currentColor"
        className={cn(sizes[size], "flex-shrink-0")}
      >
        <path d="M 50 140 Q 80 130, 110 115 Q 140 100, 170 82 Q 200 65, 230 52 Q 260 40, 290 35 Q 310 32, 330 33 Q 345 34, 355 38 Q 362 41, 365 45 Q 367 48, 365 50 Q 362 52, 358 53 Q 350 55, 340 52 Q 335 49, 330 48 Q 320 46, 310 48 Q 295 52, 280 60 Q 260 70, 240 82 Q 220 95, 200 108 Q 175 125, 150 138 Q 125 150, 100 155 Q 80 158, 65 155 Q 55 150, 50 145 Z" />
      </svg>
      {showText && (
        <span
          className={cn(
            "text-lg font-bold tracking-wider",
            textClassName
          )}
          style={{ letterSpacing: "0.15em" }}
        >
          AGUIA
        </span>
      )}
    </div>
  );
}

export function AguiaIcon({ className, size = "md" }: Omit<LogoProps, "showText" | "textClassName">) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="currentColor"
      className={cn(sizes[size], "flex-shrink-0", className)}
    >
      <path d="M 50 140 Q 80 130, 110 115 Q 140 100, 170 82 Q 200 65, 230 52 Q 260 40, 290 35 Q 310 32, 330 33 Q 345 34, 355 38 Q 362 41, 365 45 Q 367 48, 365 50 Q 362 52, 358 53 Q 350 55, 340 52 Q 335 49, 330 48 Q 320 46, 310 48 Q 295 52, 280 60 Q 260 70, 240 82 Q 220 95, 200 108 Q 175 125, 150 138 Q 125 150, 100 155 Q 80 158, 65 155 Q 55 150, 50 145 Z" />
    </svg>
  );
}
