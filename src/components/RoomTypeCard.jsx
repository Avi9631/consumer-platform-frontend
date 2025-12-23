"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InterestDialog from "@/components/InterestDialog";
import { CheckCircle, ChevronLeft, ChevronRight, ImageIcon, Heart, User, Mail, Phone as PhoneIcon, Calendar, MessageSquare } from "lucide-react";

export default function RoomTypeCard({ room }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isInterestSheetOpen, setIsInterestSheetOpen] = useState(false);
  const [isInterestDialogOpen, setIsInterestDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    moveInDate: '',
    message: ''
  });
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShowInterestClick = () => {
    setIsInterestDialogOpen(true);
  };

  const handleSubmitInterest = (e) => {
    e.preventDefault();
    console.log('Interest submitted:', { ...formData, roomId: room.id, roomName: room.name });
    // TODO: Add API call to submit interest
    setIsInterestSheetOpen(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      moveInDate: '',
      message: ''
    });
  };

  return (
    <>
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
            <Button 
              className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300 text-xs sm:text-sm h-9"
              onClick={handleShowInterestClick}
            >
              <Heart className="w-3.5 h-3.5 mr-1.5" />
              Show Interest
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Interest Dialog */}
    <InterestDialog
      isOpen={isInterestDialogOpen}
      onOpenChange={setIsInterestDialogOpen}
      propertyName={room.name}
      propertyDetails={[
        { label: "Room", value: room.name },
        { label: "Monthly Rent", value: `₹${room.pricing.find(p => p.type === "Monthly Rent")?.amount.toLocaleString()}`, className: "text-orange-400" },
        { label: "Availability", value: `${room.availability.availableBeds}/${room.availability.totalBeds} beds`, className: "text-green-400" }
      ]}
    />

    {/* Interest Form Sheet */}
    <Sheet open={isInterestSheetOpen} onOpenChange={setIsInterestSheetOpen}>
      <SheetContent className="sm:max-w-md bg-gradient-to-br from-slate-900 to-slate-950 border-white/10 text-white">
        <SheetHeader className="space-y-3">
          <SheetTitle className="text-2xl font-bold text-orange-500">
            Express Your Interest
          </SheetTitle>
          <SheetDescription className="text-gray-400 text-base">
            Interested in <span className="font-semibold text-white">{room.name}</span>? Fill out the details below and we'll get back to you shortly.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmitInterest} className="space-y-6 mt-8">
          {/* Room Summary Card */}
          <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-lg space-y-2">
            <h4 className="text-sm font-semibold text-orange-400 uppercase tracking-wide">Selected Room</h4>
            <Separator className="bg-orange-500/20" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Room Type</p>
                <p className="text-white font-medium">{room.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Monthly Rent</p>
                <p className="text-orange-400 font-semibold">₹{room.pricing.find(p => p.type === "Monthly Rent")?.amount.toLocaleString() || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Category</p>
                <p className="text-white font-medium">{room.category}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Availability</p>
                <p className="text-green-400 font-medium">{room.availability.availableBeds}/{room.availability.totalBeds} beds</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-200">
                Full Name <span className="text-orange-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-11"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                Email Address <span className="text-orange-500">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-11"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-200">
                Phone Number <span className="text-orange-500">*</span>
              </Label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-11"
                />
              </div>
            </div>

            {/* Move-in Date Field */}
            <div className="space-y-2">
              <Label htmlFor="moveInDate" className="text-sm font-medium text-gray-200">
                Preferred Move-in Date
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="moveInDate"
                  name="moveInDate"
                  type="date"
                  value={formData.moveInDate}
                  onChange={handleFormChange}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-11"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-gray-200">
                Additional Message
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Any specific requirements, questions, or preferences..."
                value={formData.message}
                onChange={handleFormChange}
                rows={4}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-orange-500 focus-visible:border-orange-500 resize-none"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10 hover:text-white h-11"
              onClick={() => setIsInterestSheetOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-orange-500/25 h-11 font-semibold"
            >
              Submit Interest
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
    </>
  );
}
