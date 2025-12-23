"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bed, IndianRupee, CheckCircle } from "lucide-react";

export default function RoomTypeSelectionDialog({ 
  isOpen, 
  onOpenChange, 
  roomTypes = [],
  onConfirm 
}) {
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);

  // Reset selections when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedRoomIds([]);
    }
  }, [isOpen]);

  const handleToggleRoom = (roomId) => {
    setSelectedRoomIds(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRoomIds.length === roomTypes.length) {
      setSelectedRoomIds([]);
    } else {
      setSelectedRoomIds(roomTypes.map(room => room.id));
    }
  };

  const handleConfirm = () => {
    if (selectedRoomIds.length > 0) {
      const selectedRooms = roomTypes.filter(room => selectedRoomIds.includes(room.id));
      onConfirm(selectedRooms);
      setSelectedRoomIds([]);
    }
  };

  const handleCancel = () => {
    setSelectedRoomIds([]);
    onOpenChange(false);
  };

  const getMonthlyRent = (room) => {
    const monthlyRent = room.pricing?.find(p => p.type === "Monthly Rent");
    return monthlyRent ? `₹${monthlyRent.amount.toLocaleString()}` : "N/A";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-linear-to-br from-slate-900 to-slate-950 border-white/10 text-white max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-500">
            Select Room Types
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-base">
            Choose one or more room types you&apos;re interested in. We&apos;ll help you find the perfect match!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Select All Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={selectedRoomIds.length === roomTypes.length && roomTypes.length > 0}
                onCheckedChange={handleSelectAll}
                className="border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium text-gray-300 cursor-pointer"
              >
                Select All Room Types
              </label>
            </div>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              {selectedRoomIds.length} of {roomTypes.length} selected
            </Badge>
          </div>

          <Separator className="bg-white/10" />

          {/* Room Types List */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {roomTypes.map((room) => {
                const isSelected = selectedRoomIds.includes(room.id);
                const availableBeds = room.availability?.availableBeds || 0;
                const totalBeds = room.availability?.totalBeds || 0;
                
                return (
                  <div
                    key={room.id}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/10'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => handleToggleRoom(room.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="pointer-events-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          id={`room-${room.id}`}
                          checked={isSelected}
                          className="mt-1 border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-white text-base mb-1">
                              {room.name}
                            </h4>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                {room.category}
                              </Badge>
                              {room.ac && (
                                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
                                  AC
                                </Badge>
                              )}
                              {room.attachedWashroom && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                  Attached Bathroom
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-orange-400 font-bold text-lg">
                              <IndianRupee className="w-4 h-4" />
                              {getMonthlyRent(room).replace('₹', '')}
                            </div>
                            <p className="text-xs text-gray-400">per month</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Bed className="w-4 h-4" />
                            <span>Room Size: {room.roomSize || 'N/A'}</span>
                          </div>
                          
                          <div className={`flex items-center gap-1 font-medium ${
                            availableBeds > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="text-xs">{availableBeds}/{totalBeds} beds available</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 hover:text-white"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={selectedRoomIds.length === 0}
          >
            Continue with {selectedRoomIds.length} {selectedRoomIds.length === 1 ? 'Room' : 'Rooms'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
