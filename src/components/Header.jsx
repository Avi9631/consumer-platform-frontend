"use client";

import { MapPin, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { UserRound } from "lucide-react";

/**
 * Header Component
 * Application header with logo, location selector, and user avatar
 */
export default function Header({ 
  scrolled, 
  selectedLocation, 
  onOpenLocationSheet 
}) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-[0_0_30px_rgba(251,146,60,0.15)] border-b border-primary/20"
          : "bg-gradient-to-b from-background/60 to-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xl md:text-2xl font-bold hover:scale-105 transition-transform cursor-pointer">
          Real
          <span className="text-primary drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]">
            Estate
          </span>
        </div>
        <div className="flex items-center gap-3">
          {selectedLocation && (
            <Button
              variant="outline"
              onClick={onOpenLocationSheet}
              className="hidden md:flex items-center gap-2 rounded-full bg-primary/10 border-primary/20 hover:bg-primary/20"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium truncate max-w-[150px]">
                {selectedLocation.name}
              </span>
            </Button>
          )}
          <Avatar>
            <AvatarFallback><UserRound  /></AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
