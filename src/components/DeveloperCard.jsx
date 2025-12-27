"use client";

import { Building2, MapPin, Star, Briefcase, Award, Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * Enhanced DeveloperCard Component - Compact & Responsive
 * Displays real estate developer information with rich visual hierarchy
 * Optimized for mobile and desktop screens
 */
export default function DeveloperCard({ developer, onClick }) {
  const router = useRouter();
  
  // Calculate total projects from statistics
  const statistics = developer?.statistics || {};
  const totalProjects = 
    (statistics.projectsCompleted || 0) + 
    (statistics.projectsOngoing || 0) + 
    (statistics.projectsUpcoming || 0);
  
  // Get location from contact address
  const location = developer?.contact?.address?.city || developer?.location;
  
  // Check if verified/featured
  const isVerified = developer?.metadata?.verificationStatus === "verified";
  const isFeatured = developer?.metadata?.featured;

  const handleViewDetails = (e) => {
    e.stopPropagation();
    router.push(`/developer/${developer.id}`);
  };

  return (
    <Card
      onClick={onClick}
      className="w-full group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-border/60 hover:border-primary/40 hover:-translate-y-1.5 bg-gradient-to-br from-background to-muted/20"
    >
      {/* Compact Header with Gradient */}
      <div className="relative h-10 bg-gradient-to-br from-primary via-primary/90 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
          }} />
        </div>
        
        {/* Compact Status Badges */}
        <div className="absolute top-1.5 right-1.5 flex gap-1">
          {isFeatured && (
            <Badge className="h-4 px-1 text-[9px] bg-yellow-500/90 hover:bg-yellow-500 border-0 font-semibold">
              <Star className="w-2 h-2 mr-0.5 fill-white" />
              <span className="hidden xs:inline">Featured</span>
            </Badge>
          )}
          {isVerified && (
            <Badge className="h-4 px-1 text-[9px] bg-emerald-500/90 hover:bg-emerald-500 border-0 font-semibold">
              <Award className="w-2 h-2" />
            </Badge>
          )}
        </div>
      </div>

      {/* Compact Logo */}
      <div className="relative -mt-7 px-3">
        <div className="w-14 h-14 rounded-lg border-3 border-background bg-white shadow-lg overflow-hidden group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
          <div className="relative w-full h-full">
            <Image
              src={developer.logo}
              alt={`${developer.name} logo`}
              fill
              className="object-contain p-2"
              sizes="56px"
            />
          </div>
        </div>
      </div>

      {/* Main Content Section - Compact */}
      <div className="px-3 pt-2 pb-3 space-y-2">
        {/* Developer Name & Location */}
        <div className="space-y-0.5">
          <h3 className="font-bold text-md leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {developer.name}
          </h3>
          
          {developer.tagline && (
            <p className="text-[10px] text-muted-foreground italic line-clamp-1">
              "{developer.tagline}"
            </p>
          )}
          
          {location && (
            <div className="flex items-center gap-0.5 text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-[10px] font-medium line-clamp-1">{location}</span>
            </div>
          )}
        </div>

        {/* Experience & Year - Compact Row */}
        <div className="flex items-center gap-1.5 text-[10px]">
          {developer.yearsOfExperience && (
            <div className="flex items-center gap-1 py-1 px-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <Briefcase className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="font-bold text-primary whitespace-nowrap">
                {developer.yearsOfExperience}+ Yrs
              </span>
            </div>
          )}
          
          {developer.establishedYear && (
            <div className="flex items-center gap-1 py-1 px-2 rounded-full bg-muted/60">
              <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="font-semibold text-muted-foreground whitespace-nowrap">
                {developer.establishedYear}
              </span>
            </div>
          )}
        </div>

        {/* Compact Project Statistics */}
        <div className="space-y-1.5">
          {/* Total Projects - Compact */}
          <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 group-hover:border-primary/30 transition-all">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-extrabold text-primary leading-none">
                {totalProjects}
              </div>
              <div className="text-[9px] text-muted-foreground font-semibold mt-0.5 uppercase tracking-wide">
                Total Projects
              </div>
            </div>
          </div>

          {/* Stats Grid - Compact */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className="py-1.5 px-1.5 rounded-md bg-gradient-to-br from-emerald-50 to-emerald-50/50 dark:from-emerald-950/30 dark:to-emerald-950/10 border border-emerald-200/60 dark:border-emerald-800/40 text-center">
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-500 leading-none">
                {statistics.projectsCompleted || 0}
              </div>
              <div className="text-[9px] text-emerald-600/70 dark:text-emerald-500/70 font-semibold mt-0.5 uppercase">
                Done
              </div>
            </div>
            
            <div className="py-1.5 px-1.5 rounded-md bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/30 dark:to-blue-950/10 border border-blue-200/60 dark:border-blue-800/40 text-center">
              <div className="text-sm font-bold text-blue-600 dark:text-blue-500 leading-none">
                {statistics.projectsOngoing || 0}
              </div>
              <div className="text-[9px] text-blue-600/70 dark:text-blue-500/70 font-semibold mt-0.5 uppercase">
                Active
              </div>
            </div>

            <div className="py-1.5 px-1.5 rounded-md bg-gradient-to-br from-orange-50 to-orange-50/50 dark:from-orange-950/30 dark:to-orange-950/10 border border-orange-200/60 dark:border-orange-800/40 text-center">
              <div className="text-sm font-bold text-orange-600 dark:text-orange-500 leading-none">
                {statistics.projectsUpcoming || 0}
              </div>
              <div className="text-[9px] text-orange-600/70 dark:text-orange-500/70 font-semibold mt-0.5 uppercase">
                Coming
              </div>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <Button 
          onClick={handleViewDetails}
          className="w-full h-8 text-xs font-semibold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white shadow-md hover:shadow-lg transition-all group/btn"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
        </Button>

        {/* Compact View Details Hint */}
        {/* <div className="pt-0.5 flex items-center justify-center">
          <div className="text-[10px] text-muted-foreground/60 group-hover:text-primary/80 font-medium transition-colors flex items-center gap-1">
            <span className="hidden xs:inline">Click for details</span>
            <span className="xs:hidden">Tap for details</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </div>
        </div> */}
      </div>
    </Card>
  );
}
