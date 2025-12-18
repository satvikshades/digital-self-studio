"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Zap } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
  isProcessing: boolean;
}

const WebcamCapture = ({ onCapture, isProcessing }: WebcamCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      setHasPermission(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const flipCamera = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Calculate square crop (face-centered)
    const size = Math.min(video.videoWidth, video.videoHeight);
    const offsetX = (video.videoWidth - size) / 2;
    const offsetY = (video.videoHeight - size) / 2;

    // Set canvas to target resolution
    canvas.width = 768;
    canvas.height = 768;

    // Mirror for selfie mode
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Draw cropped and scaled image
    ctx.drawImage(
      video,
      offsetX,
      offsetY,
      size,
      size,
      0,
      0,
      768,
      768
    );

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const imageData = canvas.toDataURL("image/png");
    
    setTimeout(() => {
      setIsCapturing(false);
      onCapture(imageData);
    }, 300);
  };

  if (hasPermission === false) {
    return (
      <div className="glass-panel p-8 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
          <Camera className="w-10 h-10 text-destructive" />
        </div>
        <h3 className="text-xl font-orbitron text-foreground mb-2">
          Camera Access Required
        </h3>
        <p className="text-muted-foreground mb-6">
          Please enable camera permissions to create your Digital Self
        </p>
        <Button variant="cyber" onClick={startCamera}>
          <Camera className="mr-2" />
          Enable Camera
        </Button>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="glass-panel p-8 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
          <Camera className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-xl font-orbitron text-foreground mb-2">
          Initializing Camera
        </h3>
        <p className="text-muted-foreground">
          Requesting camera access...
        </p>
      </div>
    );
  }

  return (
    <div className="relative animate-fade-in">
      {/* Video Container */}
      <div className="relative glass-panel overflow-hidden">
        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none scan-line z-10" />
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary z-20" />
        <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary z-20" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary z-20" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary z-20" />

        {/* Face alignment guide */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative">
            {/* Oval guide */}
            <div 
              className="w-48 h-64 md:w-56 md:h-72 rounded-[50%] border-2 border-dashed border-primary/60"
              style={{
                boxShadow: "0 0 30px hsl(var(--neon-cyan) / 0.3), inset 0 0 30px hsl(var(--neon-cyan) / 0.1)"
              }}
            />
            {/* Center crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-[1px] bg-primary/60" />
              <div className="w-[1px] h-4 bg-primary/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Alignment text */}
        <div className="absolute top-4 left-0 right-0 text-center z-20">
          <span className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-primary font-medium">
            Align your face within the guide
          </span>
        </div>

        {/* Video feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full aspect-square object-cover ${
            facingMode === "user" ? "scale-x-[-1]" : ""
          } ${isCapturing ? "animate-glitch" : ""}`}
        />

        {/* Capture flash effect */}
        {isCapturing && (
          <div className="absolute inset-0 bg-primary/30 animate-pulse z-30" />
        )}

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={flipCamera}
          disabled={isProcessing}
          className="w-12 h-12 rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          variant="capture"
          onClick={capturePhoto}
          disabled={isProcessing || isCapturing}
          className="relative"
        >
          {isProcessing ? (
            <>
              <div className="w-6 h-6 border-2 border-background border-t-transparent rounded-full animate-spin" />
              <span className="ml-2">Processing...</span>
            </>
          ) : (
            <>
              <Zap className="w-6 h-6" />
              <span>Capture</span>
            </>
          )}
        </Button>

        <div className="w-12 h-12" /> {/* Spacer for symmetry */}
      </div>
    </div>
  );
};

export default WebcamCapture;
