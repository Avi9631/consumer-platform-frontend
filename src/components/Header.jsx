"use client";

import { useState } from "react";
import { MapPin, UserRound, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import LoginDialog from "./LoginDialog";

/**
 * Header Component
 * Application header with logo, location selector, and user avatar
 */
export default function Header({ 
  scrolled, 
  selectedLocation, 
  onOpenLocationSheet 
}) {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const handleLoginSuccess = (userData) => {
    login(userData);
  };

  const handleLogout = () => {
    logout();
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
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <AvatarImage src={user?.profileImage} alt={user?.firstName} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {user?.nameInitial || <UserRound />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      {user?.phone && (
                        <p className="text-xs text-muted-foreground">
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
