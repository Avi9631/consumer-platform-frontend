"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";

export default function RoomTypeCard({ room }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const roomImages = room.images && room.images.length > 0 ? room.images : [];

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setImageError(false);
    setCurrentImageIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setImageError(false);
    setCurrentImageIndex((prev) => (prev + 1) % roomImages.length);
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <Card className="shrink-0 w-[280px] sm:w-[320px] md:w-[350px] lg:w-[380px] bg-linear-to-br from-slate-700/60 to-slate-800/60 border-white/10 backdrop-blur-xl hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 group overflow-hidden snap-start">
      <CardContent className="p-0">
        {/* Room Image Carousel */}
        {roomImages.length > 0 ? (
          <div className="relative h-48 w-full overflow-hidden group/carousel">
            {!imageError ? (
              <Image
                src={roomImages[currentImageIndex].url || roomImages[currentImageIndex]}
                alt={`${room.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/80 to-slate-800/80 flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-slate-500 mb-2" />
                <p className="text-slate-400 text-sm font-medium">Failed to load image</p>
              </div>
            )}
            
            {/* Image Counter Badge */}
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
              {currentImageIndex + 1} / {roomImages.length}
            </div>
            
            {/* Navigation Arrows - Only show if multiple images */}
            {roomImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white hover:bg-orange-500 z-10 transition-all duration-300 border border-white/10 h-8 w-8 p-0 rounded-full opacity-0 group-hover/carousel:opacity-100"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white hover:bg-orange-500 z-10 transition-all duration-300 border border-white/10 h-8 w-8 p-0 rounded-full opacity-0 group-hover/carousel:opacity-100"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
            
            {/* Image Indicators */}
            {roomImages.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
                {roomImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex 
                        ? 'bg-orange-500 w-4 shadow-lg shadow-orange-500/50' 
                        : 'bg-white/40 hover:bg-white/70 w-1.5'
                    }`}
                    onClick={(e) => handleDotClick(e, idx)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Placeholder when no images available
          <div className="relative h-48 w-full bg-gradient-to-br from-slate-700/80 to-slate-800/80 flex flex-col items-center justify-center">
            <ImageIcon className="w-12 h-12 text-slate-500 mb-2" />
            <p className="text-slate-400 text-sm font-medium">No images available</p>
          </div>
        )}
        
        <div className="p-4 sm:p-5">
          <div className="mb-4">
            <h4 className="font-bold text-white text-base sm:text-lg mb-2">{room.name}</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">{room.category}</Badge>
              {room.ac && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">AC</Badge>}
              {room.attachedWashroom && <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Attached Bathroom</Badge>}
              {room.balcony && <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Balcony</Badge>}
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs sm:text-sm">Room Size</span>
              <span className="text-white font-semibold text-xs sm:text-sm">{room.roomSize}</span>
            </div>
            <Separator className="bg-white/10" />
            
            {/* Dynamic Pricing List */}
            {room.pricing && room.pricing.map((price, idx) => {
              const isMainPrice = price.type === "Monthly Rent";
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className={`text-xs sm:text-sm ${isMainPrice ? 'text-gray-300 font-medium' : 'text-gray-400'}`}>
                        {price.type}
                        {!price.mandatory && <span className="text-xs text-gray-500 ml-1">(Optional)</span>}
                      </span>
                      {price.note && (
                        <p className="text-xs text-gray-500 mt-0.5">{price.note}</p>
                      )}
                    </div>
                    <span className={`font-semibold text-xs sm:text-sm whitespace-nowrap ml-2 ${isMainPrice ? 'text-orange-500 font-bold text-sm sm:text-base' : 'text-white'}`}>
                      ₹{price.amount.toLocaleString()}
                      {price.unit && <span className="text-xs text-gray-400 ml-1">{price.unit}</span>}
                      {price.refundable && <span className="text-xs text-green-400 ml-1">(Refundable)</span>}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Room Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="mb-4">
              <h5 className="text-white font-semibold text-xs mb-2">Room Amenities</h5>
              <div className="grid grid-cols-2 gap-2">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs">
                    <CheckCircle className="w-3 h-3 text-green-500 shrink-0" />
                    <span className="text-gray-300 truncate">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            {/* Availability Status */}
            <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                <span className="text-green-400 font-medium">Available Beds</span>
                <span className="text-green-400 font-bold">{room.availability.availableBeds}/{room.availability.totalBeds}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Next Available</span>
                <span className="text-white font-semibold">{room.availability.nextAvailability}</span>
              </div>
            </div>
            <Button className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300 text-xs sm:text-sm h-9">
              Book Now - ₹{room.pricing.find(p => p.type === "Booking Amount")?.amount.toLocaleString() || "0"} Token
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
