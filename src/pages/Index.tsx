import { useState } from "react";
import { toast } from "sonner";
import WebcamCapture from "@/components/WebcamCapture";
import AvatarViewer from "@/components/AvatarViewer";
import StepIndicator from "@/components/StepIndicator";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { generateAvatar } from "@/lib/imageGeneration";
import { Smile } from "lucide-react";

type AppStep = "camera" | "capture" | "processing" | "complete";

const Index = () => {
  const [step, setStep] = useState<AppStep>("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setStep("processing");
    setIsProcessing(true);

    try {
      const avatar = await generateAvatar(imageData);
      setGeneratedImage(avatar);
      setStep("complete");
      toast.success("Your avatar is ready!");
    } catch (error) {
      console.error("Generation failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate avatar";
      toast.error(errorMessage);
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
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-xl">
        {/* Header */}
        <header className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-3">
            <Smile className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground">
              Avatar Creator
            </h1>
          </div>
          <p className="text-muted-foreground text-base">
            Create your personalized cartoon avatar
          </p>
        </header>

        {/* Step Indicator */}
        <div className="mb-10">
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
        <footer className="mt-14 text-center text-sm text-muted-foreground">
          <p>Powered by AI</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
