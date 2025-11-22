"use client";

import { useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getYouTubeEmbedUrl } from "@/lib/utils/videoHelpers";

/**
 * VirtualTourCard Component
 * Displays virtual tour with video playback on hover
 */
export default function VirtualTourCard({ tour, isHovered, onHover }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    onHover(tour.id, true);
    const iframe = videoRef.current;
    if (iframe && iframe.tagName === "IFRAME") {
      const currentSrc = iframe.getAttribute("data-src") || "";
      iframe.src = getYouTubeEmbedUrl(currentSrc);
    } else if (iframe && iframe.tagName === "VIDEO") {
      iframe.play().catch((e) => console.log("Video play failed:", e));
    }
  };

  const handleMouseLeave = () => {
    onHover(tour.id, false);
    const iframe = videoRef.current;
    if (iframe && iframe.tagName === "IFRAME") {
      iframe.src = "";
    } else if (iframe && iframe.tagName === "VIDEO") {
      iframe.pause();
      iframe.currentTime = 0;
    }
  };

  const isYouTubeVideo =
    tour.videoUrl.includes("youtube.com") || tour.videoUrl.includes("youtu.be");

  return (
    <Card
      className="shrink-0 w-[180px] sm:w-[200px] md:w-[220px] group cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden p-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-9/16">
        {/* Video/iframe element */}
        {isYouTubeVideo ? (
          <>
            <Image
              src={tour.thumbnail}
              alt={tour.title}
              fill
              className="object-cover"
            />
            <iframe
              ref={videoRef}
              data-src={tour.videoUrl}
              title={tour.title}
              className="w-full h-full object-cover absolute inset-0 z-10"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          </>
        ) : (
          <video
            ref={videoRef}
            src={tour.videoUrl}
            poster={tour.thumbnail}
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>

        {/* Play Indicator */}
        {!isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-primary/60 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
              <Play
                className="w-6 h-6 text-white ml-0.5"
                fill="currentColor"
              />
            </div>
          </div>
        )}

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <Badge className="mb-1 text-[10px]">{tour.title}</Badge>
          <p className="text-xs font-semibold text-white">{tour.price}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            📍 {tour.location}
          </p>
        </div>

        {/* Hover to Play Text */}
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
        >
          {isHovered ? "▶ Playing" : "▶ Hover"}
        </Badge>
      </div>
    </Card>
  );
}
