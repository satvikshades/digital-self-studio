import { useState, useEffect } from "react";
import { toast } from "sonner";
import WebcamCapture from "@/components/WebcamCapture";
import AvatarViewer from "@/components/AvatarViewer";
import StepIndicator from "@/components/StepIndicator";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { generateAvatar, checkSDAvailability } from "@/lib/imageGeneration";
import { Cpu, AlertTriangle } from "lucide-react";

type AppStep = "camera" | "capture" | "processing" | "complete";

const Index = () => {
  const [step, setStep] = useState<AppStep>("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSDAvailable, setIsSDAvailable] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check SD availability on mount
    checkSDAvailability().then(setIsSDAvailable);
  }, []);

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setStep("processing");
    setIsProcessing(true);

    try {
      const avatar = await generateAvatar(imageData);
      setGeneratedImage(avatar);
      setStep("complete");
      toast.success("Your Digital Self is ready!");
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error(
        "Failed to generate avatar. Make sure AUTOMATIC1111 is running locally with --api --cors-allow-origins flags."
      );
      setStep("camera");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setCapturedImage(null);
    setGeneratedImage(null);
    setStep("camera");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl animate-float" />
        <div 
          className="absolute bottom-1/4 -right-32 w-64 h-64 bg-neon-magenta/10 rounded-full blur-3xl animate-float" 
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/5 rounded-full animate-rotate-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-secondary/5 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4">
            <Cpu className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-orbitron text-gradient-cyber">
              Digital Self
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Transform yourself into a futuristic AI avatar
          </p>
        </header>

        {/* SD Status Warning */}
        {isSDAvailable === false && (
          <div className="mb-6 p-4 glass-panel border-destructive/50 animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-destructive mb-1">
                  Stable Diffusion Not Detected
                </h4>
                <p className="text-sm text-muted-foreground">
                  Start AUTOMATIC1111 WebUI with: 
                  <code className="ml-2 px-2 py-0.5 bg-muted rounded text-xs font-mono">
                    --api --cors-allow-origins=*
                  </code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={step} />
        </div>

        {/* Main Content */}
        <main>
          {step === "camera" && (
            <WebcamCapture 
              onCapture={handleCapture} 
              isProcessing={isProcessing}
            />
          )}

          {step === "processing" && capturedImage && (
            <ProcessingOverlay capturedImage={capturedImage} />
          )}

          {step === "complete" && capturedImage && generatedImage && (
            <AvatarViewer
              originalImage={capturedImage}
              generatedImage={generatedImage}
              onRetry={handleRetry}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Powered by Stable Diffusion • Runs 100% locally
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
