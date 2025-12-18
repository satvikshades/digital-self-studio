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
    link.download = "digital-self-avatar.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await fetch(generatedImage).then((r) => r.blob());
        const file = new File([blob], "digital-self.png", { type: "image/png" });
        await navigator.share({
          title: "My Digital Self",
          text: "Check out my AI-generated avatar!",
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
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">Digital Self Ready</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-orbitron neon-text mb-2">
          Your Avatar Awaits
        </h2>
        <p className="text-muted-foreground">
          Your futuristic digital identity has been rendered
        </p>
      </div>

      {/* Avatar Display */}
      <div className="relative glass-panel overflow-hidden group">
        {/* Animated border */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-75"
          style={{
            background: "linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--neon-magenta)), hsl(var(--neon-cyan)))",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
            padding: "2px",
          }}
        >
          <div className="w-full h-full bg-background rounded-2xl" />
        </div>

        {/* Image container */}
        <div className="relative z-10 p-1">
          {showComparison ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full aspect-square object-cover rounded-xl"
                />
                <span className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
                  Original
                </span>
              </div>
              <div className="relative">
                <img
                  src={generatedImage}
                  alt="Digital Self"
                  className="w-full aspect-square object-cover rounded-xl"
                />
                <span className="absolute bottom-2 left-2 bg-primary/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-primary-foreground">
                  Digital Self
                </span>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={generatedImage}
                alt="Your Digital Self"
                className="w-full aspect-square object-cover rounded-xl"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end justify-center pb-6">
                <span className="text-foreground font-orbitron text-lg">
                  Your Digital Self
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Glow effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-neon-cyan/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-neon-magenta/20 rounded-full blur-3xl" />
      </div>

      {/* Toggle comparison */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          {showComparison ? "Hide comparison" : "Show before/after comparison"}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="cyber" size="lg" onClick={handleDownload}>
          <Download className="w-5 h-5 mr-2" />
          Download Avatar
        </Button>

        {navigator.share && (
          <Button variant="outline" size="lg" onClick={handleShare}>
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        )}

        <Button variant="outline" size="lg" onClick={onRetry}>
          <RefreshCw className="w-5 h-5 mr-2" />
          Create New
        </Button>
      </div>
    </div>
  );
};

export default AvatarViewer;
