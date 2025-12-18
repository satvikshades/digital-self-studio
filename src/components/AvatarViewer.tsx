"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Share2, Sparkles } from "lucide-react";

interface AvatarViewerProps {
  originalImage: string;
  generatedImage: string;
  onRetry: () => void;
}

const AvatarViewer = ({ originalImage, generatedImage, onRetry }: AvatarViewerProps) => {
  const [showComparison, setShowComparison] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "my-avatar.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await fetch(generatedImage).then((r) => r.blob());
        const file = new File([blob], "my-avatar.png", { type: "image/png" });
        await navigator.share({
          title: "My Avatar",
          text: "Check out my cartoon avatar!",
          files: [file],
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Success Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-3">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Avatar Ready</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-1">
          Your Avatar
        </h2>
        <p className="text-muted-foreground text-sm">
          Your personalized cartoon avatar is ready
        </p>
      </div>

      {/* Avatar Display */}
      <div className="relative clean-card overflow-hidden p-1">
        {/* Image container */}
        <div className="relative">
          {showComparison ? (
            <div className="grid grid-cols-2 gap-1">
              <div className="relative">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full aspect-square object-cover rounded-xl"
                />
                <span className="absolute bottom-2 left-2 bg-card/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
                  Original
                </span>
              </div>
              <div className="relative">
                <img
                  src={generatedImage}
                  alt="Avatar"
                  className="w-full aspect-square object-cover rounded-xl"
                />
                <span className="absolute bottom-2 left-2 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-primary-foreground">
                  Avatar
                </span>
              </div>
            </div>
          ) : (
            <img
              src={generatedImage}
              alt="Your Avatar"
              className="w-full aspect-square object-cover rounded-xl"
            />
          )}
        </div>
      </div>

      {/* Toggle comparison */}
      <div className="mt-3 text-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {showComparison ? "Hide comparison" : "Show before/after"}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button size="lg" onClick={handleDownload} className="w-full sm:w-auto btn-clean rounded-full">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        {navigator.share && (
          <Button variant="outline" size="lg" onClick={handleShare} className="w-full sm:w-auto btn-clean rounded-full">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}

        <Button variant="outline" size="lg" onClick={onRetry} className="w-full sm:w-auto btn-clean rounded-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          New Avatar
        </Button>
      </div>
    </div>
  );
};

export default AvatarViewer;
