"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Heart, Mail, Phone as PhoneIcon, Bed } from "lucide-react";

export default function InterestDialog({ 
  isOpen, 
  onOpenChange, 
  propertyName,
  propertyDetails,
  selectedRooms = null // Array of room objects when called from property page
}) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => {
    onOpenChange(false);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <>
      {/* Confirmation AlertDialog */}
      <AlertDialog open={isOpen && !showSuccess} onOpenChange={onOpenChange}>
        <AlertDialogContent className="bg-linear-to-br from-slate-900 to-slate-950 border-white/10 text-white sm:max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-orange-500 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Show Interest in {propertyName}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 text-base space-y-3 pt-2">
              <p>
                {selectedRooms && selectedRooms.length > 0
                  ? `Are you sure you want to express interest in ${selectedRooms.length} room ${selectedRooms.length === 1 ? 'type' : 'types'}?`
                  : 'Are you sure you want to express interest in this property?'}
              </p>
              
              {/* Show selected rooms if provided */}
              {/* {selectedRooms && selectedRooms.length > 0 ? (
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg space-y-2">
                  <p className="text-sm font-semibold text-orange-400">Selected Room Types:</p>
                  <ScrollArea className={selectedRooms.length > 3 ? "h-[200px]" : ""}>
                    <div className="space-y-2">
                      {selectedRooms.map((room, index) => {
                        const monthlyRent = room.pricing?.find(p => p.type === "Monthly Rent");
                        return (
                          <div key={room.id || index} className="p-2 bg-white/5 border border-white/10 rounded">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-semibold text-white text-sm">{room.name}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                    {room.category}
                                  </Badge>
                                  {room.ac && (
                                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                                      AC
                                    </Badge>
                                  )}
                                  {room.availability && (
                                    <span className="text-xs text-green-400">
                                      {room.availability.availableBeds || 0} beds available
                                    </span>
                                  )}
                                </div>
                              </div>
                              {monthlyRent && (
                                <div className="text-right">
                                  <p className="text-orange-400 font-bold text-sm">
                                    ₹{monthlyRent.amount.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-400">per month</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              ) : propertyDetails ? (
                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg space-y-1">
                  {propertyDetails.map((detail, index) => (
                    <p key={index} className="text-sm text-gray-300">
                      <span className="font-semibold text-white">{detail.label}:</span>{" "}
                      <span className={detail.className || ""}>{detail.value}</span>
                    </p>
                  ))}
                </div>
              ) : null} */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              onClick={handleConfirm}
            >
              Confirm Interest
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Message AlertDialog */}
      <AlertDialog open={showSuccess} onOpenChange={handleCloseSuccess}>
        <AlertDialogContent className="bg-linear-to-br from-slate-900 to-slate-950 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-green-500 flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              Inquiry Received!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 text-base space-y-4 pt-2">
              <p className="text-gray-300">
                Thank you for your interest in <span className="font-semibold text-white">{propertyName}</span>!
              </p>
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-300">
                    Details will be sent to your <span className="font-semibold text-white">registered email address</span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <PhoneIcon className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-300">
                    You&apos;ll receive a call on your <span className="font-semibold text-white">registered phone number</span>
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Our team will reach out to you shortly with more information and next steps.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white w-full"
              onClick={handleCloseSuccess}
            >
              Got it, Thanks!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
