"use client";

import { useState } from "react";
import { MapPin, UserRound, LogOut, User, Phone, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import LoginDialog from "./LoginDialog";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
 
/**
 * Header Component
 * Application header with logo, location selector, and user avatar
 */
export default function Header({ 
  scrolled, 
  selectedLocation, 
  onOpenLocationSheet 
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileSheetOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-[0_0_30px_rgba(251,146,60,0.15)] border-b border-primary/20"
            : "bg-gradient-to-b from-background/60 to-transparent backdrop-blur-sm"
        }`}
      >
        <div className="  mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={'/'} className="text-xl md:text-2xl font-bold hover:scale-105 transition-transform cursor-pointer">
            Real
            <span className="text-primary drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]">
              Estate
            </span>
          </Link>
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
            
            {isAuthenticated ? (
              <Avatar 
                className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => setProfileSheetOpen(true)}
              >
                <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {user?.nameInitial || <UserRound className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Button
                variant="outline"
                onClick={() => setLoginDialogOpen(true)}
                className="rounded-full"
              >
                <UserRound className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
      />

      <Sheet open={profileSheetOpen} onOpenChange={setProfileSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Profile</SheetTitle>
            <SheetDescription>
              Your account information
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* User Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                <AvatarFallback className="bg-primary/20 text-primary font-semibold text-2xl">
                  {user?.nameInitial || <UserRound className="w-12 h-12" />}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </h3>
              </div>
            </div>

            <Separator />

            {/* User Details */}
            <div className="space-y-4">
              {user?.phone && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}

              {user?.email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              )}

              {user?.accountType && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Account Type</p>
                    <p className="font-medium">{user.accountType}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
