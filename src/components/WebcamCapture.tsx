"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw } from "lucide-react";

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
      <div className="clean-card p-8 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-destructive/10 flex items-center justify-center">
          <Camera className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Camera Access Required
        </h3>
        <p className="text-muted-foreground text-sm mb-5">
          Please enable camera permissions to create your avatar
        </p>
        <Button onClick={startCamera} className="btn-clean">
          <Camera className="mr-2 w-4 h-4" />
          Enable Camera
        </Button>
      </div>
    );
  }

  if (hasPermission === null) {
    return (
      <div className="clean-card p-8 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-soft">
          <Camera className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Initializing Camera
        </h3>
        <p className="text-muted-foreground text-sm">
          Requesting camera access...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Video Container */}
      <div className="relative clean-card overflow-hidden">
        {/* Face alignment guide */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative">
            {/* Oval guide */}
            <div 
              className="w-44 h-56 md:w-52 md:h-68 rounded-[50%] border-2 border-dashed border-primary/40"
            />
          </div>
        </div>

        {/* Alignment text */}
        <div className="absolute top-3 left-0 right-0 text-center z-20">
          <span className="bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-muted-foreground font-medium">
            Center your face
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
          } ${isCapturing ? "opacity-80" : ""}`}
        />

        {/* Capture flash effect */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white/50 z-30" />
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
          className="w-11 h-11 rounded-full btn-clean"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          onClick={capturePhoto}
          disabled={isProcessing || isCapturing}
          size="lg"
          className="px-8 rounded-full btn-clean shadow-lg shadow-primary/25"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Capture
            </>
          )}
        </Button>

        <div className="w-11 h-11" /> {/* Spacer for symmetry */}
      </div>
    </div>
  );
};

export default WebcamCapture;
