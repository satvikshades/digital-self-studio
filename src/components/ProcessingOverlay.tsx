import { useEffect, useState } from "react";

interface ProcessingOverlayProps {
  capturedImage: string;
}

const messages = [
  "Analyzing facial structure...",
  "Mapping biometric data...",
  "Generating neural patterns...",
  "Applying cyberpunk aesthetics...",
  "Rendering digital identity...",
  "Finalizing your avatar...",
];

const ProcessingOverlay = ({ capturedImage }: ProcessingOverlayProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 15, 95));
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Processing Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-orbitron text-gradient-cyber mb-2">
          Rendering Your Avatar
        </h2>
        <p className="text-muted-foreground text-lg">
          {messages[messageIndex]}
        </p>
      </div>

      {/* Image being processed */}
      <div className="relative glass-panel overflow-hidden">
        {/* Scanning effect */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `linear-gradient(
              to bottom,
              transparent 0%,
              transparent ${progress - 5}%,
              hsl(var(--neon-cyan) / 0.6) ${progress}%,
              transparent ${progress + 5}%,
              transparent 100%
            )`,
          }}
        />

        {/* Glitch overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />

        {/* Original image with effects */}
        <div className="relative">
          <img
            src={capturedImage}
            alt="Processing"
            className="w-full aspect-square object-cover opacity-70"
            style={{
              filter: "saturate(0.5) contrast(1.2)",
            }}
          />
          
          {/* Grid overlay */}
          <div 
            className="absolute inset-0 cyber-grid opacity-30"
            style={{
              maskImage: "radial-gradient(ellipse at center, black 50%, transparent 80%)",
            }}
          />
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-12 h-12 border-l-2 border-t-2 border-primary animate-pulse" />
        <div className="absolute top-2 right-2 w-12 h-12 border-r-2 border-t-2 border-secondary animate-pulse" />
        <div className="absolute bottom-2 left-2 w-12 h-12 border-l-2 border-b-2 border-secondary animate-pulse" />
        <div className="absolute bottom-2 right-2 w-12 h-12 border-r-2 border-b-2 border-primary animate-pulse" />
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-primary font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "var(--gradient-cyber)",
            }}
          />
        </div>
      </div>

      {/* Animated decorative elements */}
      <div className="mt-8 flex justify-center gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-primary animate-pulse"
            style={{
              animationDelay: `${i * 0.3}s`,
              boxShadow: "0 0 10px hsl(var(--neon-cyan))",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProcessingOverlay;
