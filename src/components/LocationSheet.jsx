"use client";

import { MapPin, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GoogleMapSearch from "@/components/maps/GoogleMapSearch";
import GoogleMapViewer from "@/components/maps/GoogleMapViewer";

/**
 * LocationSheet Component
 * Full-screen sheet for selecting and confirming location with map interaction
 */
export default function LocationSheet({
  isOpen,
  onOpenChange,
  searchResult,
  mapCenter,
  mapMarker,
  onSearchSelect,
  onMapInteraction,
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="full" className="p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header with Search */}
          <SheetHeader className="p-4 md:p-6 border-b bg-background/95 backdrop-blur-sm z-10">
            <div className="flex items-center justify-between mb-4">
              <SheetTitle className="text-left">
                Select Your Location
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <SheetDescription className="text-left mb-4">
              Search for an address or drag the marker on the map to adjust
              your location
            </SheetDescription>

            {/* Search Bar in Sheet */}
            <div className="w-full">
              <GoogleMapSearch
                onPlaceSelect={onSearchSelect}
                placeholder="Type to search for address or location..."
                className="w-full"
                initialValue={searchResult?.formattedAddress || ""}
              />
            </div>
          </SheetHeader>

          {/* Map Viewer - Full Height */}
          <div className="flex-1 relative p-4">
            <GoogleMapViewer
              center={mapCenter}
              zoom={16}
              marker={mapMarker}
              onMarkerDragEnd={onMapInteraction}
              onMapClick={onMapInteraction}
              height="100%"
              interactive={true}
              showCurrentLocation={true}
            />
          </div>

          {/* Footer with Selected Address */}
          {searchResult && (
            <div className="p-4 md:p-6 border-t bg-background/95 backdrop-blur-sm">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1">
                    Selected Location:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {searchResult.formattedAddress}
                  </p>
                  {searchResult.coordinates && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        Lat: {searchResult.coordinates.lat.toFixed(6)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Lng: {searchResult.coordinates.lng.toFixed(6)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
              {/* <Button
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Confirm Location
              </Button> */}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
