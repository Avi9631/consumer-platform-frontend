"use client";

import { Building2, MapPin, Star, Award, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

/**
 * DeveloperCard Component
 * Displays real estate developer information in a carousel card format
 */
export default function DeveloperCard({ developer, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="shrink-0 w-[220px] sm:w-[240px] md:w-[280px] group hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] transition-all duration-300 overflow-hidden p-0 border-primary/10 hover:border-primary/30 cursor-pointer"
    >
      {/* Logo/Image Section */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20">
        <Image
          src={developer.logo}
          alt={developer.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 220px, 280px"
        />
        {developer.featured && (
          <Badge className="absolute top-2 left-2 bg-orange-500/90 hover:bg-orange-500 text-white border-0 text-xs py-0 px-2">
            <Award className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="px-3 pb-3  space-y-2">
        {/* Developer Name */}
        <div>
          <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">
            {developer.name}
          </h3>
        </div>

        {/* Rating and Experience */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
<Badge variant="secondary" className="text-xs py-0">
          {developer.specialization}
        </Badge>          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs">{developer.experience}</span>
          </div>
        </div>
 

        {/* Projects Stats */}
        <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-border/50">
          <div className="text-center">
            <div className="text-base font-bold text-primary">
              {developer.completedProjects}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-base font-bold text-green-500">
              {developer.ongoingProjects}
            </div>
            <div className="text-xs text-muted-foreground">Ongoing</div>
          </div>
        </div>

        {/* Locations */}
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground pt-1.5 border-t border-border/50">
          <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
          <span className="line-clamp-1">
            {developer.locations.join(" • ")}
          </span>
        </div>

        {/* Total Projects Count */}
        <div className="flex items-center justify-center gap-1.5 pt-1.5 text-sm">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          <span className="font-semibold text-xs">
            {developer.projectsCount} Total Projects
          </span>
        </div>
      </div>
    </Card>
  );
}
