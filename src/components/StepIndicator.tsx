import { Camera, Scan, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "camera" | "capture" | "processing" | "complete";

interface StepIndicatorProps {
  currentStep: Step;
}

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "camera", label: "Camera", icon: Camera },
  { id: "capture", label: "Capture", icon: Scan },
  { id: "processing", label: "Processing", icon: Loader2 },
  { id: "complete", label: "Complete", icon: Sparkles },
];

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500",
                  isActive && "bg-primary text-primary-foreground neon-glow",
                  isCompleted && "bg-primary/30 text-primary",
                  isPending && "bg-muted text-muted-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 md:w-6 md:h-6",
                    isActive && step.id === "processing" && "animate-spin"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-xs md:text-sm mt-2 font-medium transition-colors",
                  isActive && "text-primary neon-text",
                  isCompleted && "text-primary/70",
                  isPending && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 md:w-16 h-[2px] mx-2 transition-all duration-500",
                  index < currentIndex
                    ? "bg-gradient-to-r from-primary to-primary"
                    : index === currentIndex
                    ? "bg-gradient-to-r from-primary to-muted"
                    : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
