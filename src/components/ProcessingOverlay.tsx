import { useEffect, useState } from "react";

interface ProcessingOverlayProps {
  capturedImage: string;
}

const ProcessingOverlay = ({ capturedImage }: ProcessingOverlayProps) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-16">
      {/* Soft blue orb - matching reference image */}
      <div className="relative mb-8">
        {/* Outer glow */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-50"
          style={{
            background: "radial-gradient(circle, hsl(210 100% 70%) 0%, transparent 70%)",
            transform: "scale(1.3)",
          }}
        />
        
        {/* Main orb */}
        <div 
          className="relative w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center animate-pulse-soft"
          style={{
            background: "radial-gradient(circle at 30% 30%, hsl(210 100% 95%), hsl(210 100% 75%) 50%, hsl(210 100% 55%) 100%)",
            boxShadow: "0 20px 60px -15px hsl(210 100% 55% / 0.5), inset 0 -10px 40px -10px hsl(210 100% 40% / 0.3)",
          }}
        >
          <span className="text-foreground text-lg font-medium">
            Generating{dots}
          </span>
        </div>
      </div>

      {/* Subtle message */}
      <p className="text-muted-foreground text-sm">
        Creating your cartoon avatar
      </p>
    </div>
  );
};

export default ProcessingOverlay;
