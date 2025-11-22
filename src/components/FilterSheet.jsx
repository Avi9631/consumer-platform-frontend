"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Home,
  Building2,
  Bed,
  Bath,
  IndianRupee,
  X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const PROPERTY_TYPES = [
  { value: "all", label: "All Types", icon: Home },
  { value: "apartment", label: "Apartment", icon: Building2 },
  { value: "villa", label: "Villa", icon: Home },
  { value: "penthouse", label: "Penthouse", icon: Building2 },
  { value: "cottage", label: "Cottage", icon: Home },
  { value: "commercial", label: "Commercial", icon: Building2 },
];

const PRICE_RANGES = [
  { value: "any", label: "Any Price", min: 0, max: Infinity },
  { value: "0-50L", label: "₹0 - ₹50 Lakh", min: 0, max: 5000000 },
  {
    value: "50L-1Cr",
    label: "₹50 Lakh - ₹1 Crore",
    min: 5000000,
    max: 10000000,
  },
  {
    value: "1Cr-2Cr",
    label: "₹1 Crore - ₹2 Crore",
    min: 10000000,
    max: 20000000,
  },
  {
    value: "2Cr-5Cr",
    label: "₹2 Crore - ₹5 Crore",
    min: 20000000,
    max: 50000000,
  },
  { value: "5Cr+", label: "₹5 Crore+", min: 50000000, max: Infinity },
];

const BEDROOM_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
];

const BATHROOM_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

export default function FilterSheet({
  open,
  onOpenChange,
  listingType,
  setListingType,
  priceRange,
  setPriceRange,
  minBedrooms,
  setMinBedrooms,
  minBathrooms,
  setMinBathrooms,
  propertyType,
  setPropertyType,
  searchRadius,
  setSearchRadius,
  onApplyFilters,
  onClearFilters,
}) {
  const hasActiveFilters =
    priceRange !== "any" ||
    minBedrooms !== "any" ||
    minBathrooms !== "any" ||
    propertyType !== "all" ||
    searchRadius !== 5;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear all
              </Button>
            )}
          </div>
          <SheetDescription>
            Customize your property search
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="px-6 py-4 space-y-6">
            {/* Listing Type */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Listing Type</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={listingType === "sale" ? "default" : "outline"}
                  onClick={() => setListingType("sale")}
                  className="w-full"
                >
                  For Sale
                </Button>
                <Button
                  variant={listingType === "rent" ? "default" : "outline"}
                  onClick={() => setListingType("rent")}
                  className="w-full"
                >
                  For Rent
                </Button>
              </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <IndianRupee className="h-4 w-4" />
                Price Range
              </h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => (
                  <Button
                    key={range.value}
                    variant={priceRange === range.value ? "default" : "outline"}
                    onClick={() => setPriceRange(range.value)}
                    className="w-full justify-start"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Bedrooms */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Bedrooms
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {BEDROOM_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      minBedrooms === option.value ? "default" : "outline"
                    }
                    onClick={() => setMinBedrooms(option.value)}
                    className="w-full"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Bathrooms */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Bath className="h-4 w-4" />
                Bathrooms
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {BATHROOM_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      minBathrooms === option.value ? "default" : "outline"
                    }
                    onClick={() => setMinBathrooms(option.value)}
                    className="w-full"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Property Type */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Home className="h-4 w-4" />
                Property Type
              </h3>
              <div className="space-y-2">
                {PROPERTY_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    variant={
                      propertyType === type.value ? "default" : "outline"
                    }
                    onClick={() => setPropertyType(type.value)}
                    className="w-full justify-start"
                  >
                    <type.icon className="w-4 h-4 mr-2" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Search Radius */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Search Radius</h3>
                <Badge variant="secondary">{searchRadius} km</Badge>
              </div>
              <Slider
                value={[searchRadius]}
                onValueChange={(value) => setSearchRadius(value[0])}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white dark:bg-gray-950">
          <Button
            onClick={() => {
              onApplyFilters();
              onOpenChange(false);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
