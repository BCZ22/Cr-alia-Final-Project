import { cn } from "@/lib/utils"

interface CrealiaLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function CrealiaLogo({ className, size = "md" }: CrealiaLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center",
          sizeClasses[size],
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-1/2 h-1/2 text-white" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Créalia
      </span>
    </div>
  )
}
