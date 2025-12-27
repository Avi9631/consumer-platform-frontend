"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Building2,
  Filter,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getDevelopers, searchDevelopers } from "@/lib/services/developerService";
import Header from "@/components/Header";
import DeveloperCard from "@/components/DeveloperCard";
import useLocationStore from "@/stores/locationStore";

export default function DeveloperSearchPage() {
  const location = useLocationStore((state) => state.location);

  // Local state
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  // Load developers on mount
  useEffect(() => {
    loadDevelopers(currentPage);
  }, []);

  // Handle scroll detection for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load developers with pagination
  const loadDevelopers = async (page = 1) => {
    setLoading(true);
    setIsSearching(false);
    try {
      const result = await getDevelopers({ page, limit });
      console.log('Developers loaded:', result);
      setDevelopers(result.data || []);
      setTotalResults(result.pagination?.total || 0);
      setTotalPages(result.pagination?.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error loading developers:", error);
      setDevelopers([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Search developers by name
  const performSearch = async (query, page = 1) => {
    if (!query || query.trim() === "") {
      // If search is empty, load all developers
      loadDevelopers(page);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const result = await searchDevelopers({ name: query, page, limit });
      console.log('Search results:', result);
      setDevelopers(result.data || []);
      setTotalResults(result.pagination?.total || 0);
      setTotalPages(result.pagination?.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error searching developers:", error);
      setDevelopers([]);
      setTotalResults(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        performSearch(searchQuery, 1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    loadDevelopers(1);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    if (isSearching && searchQuery) {
      performSearch(searchQuery, newPage);
    } else {
      loadDevelopers(newPage);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
        {/* Premium gradient background with decorative elements */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-transparent to-purple-500/5"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-conic from-orange-500/20 via-transparent to-orange-500/20 rounded-full blur-3xl"></div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-linear-to-bl from-orange-500/20 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-purple-600/10 to-transparent blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
       
        <div className="relative z-10">
          <Header
            scrolled={scrolled}
            selectedLocation={location}
          />
        </div>
       
        {/* Search Bar Section */}
        <div className="sticky top-14 z-40">
          <div className="px-2 sm:px-4 py-2 sm:py-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full max-w-screen-2xl mx-auto">
              <div className="flex-1 w-full sm:max-w-2xl min-w-0 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-primary drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                <Input
                  type="text"
                  placeholder="Search developers by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-transparent border hover:bg-primary/5 focus:bg-primary/5"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-auto">
                <Badge variant="outline" className="text-xs">
                  {totalResults} {totalResults === 1 ? 'Developer' : 'Developers'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden w-full mt-16">
          {/* Developer Listings Section */}
          <div className="w-full overflow-y-auto transition-all duration-300 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-gray-400">
                  {isSearching ? 'Searching developers...' : 'Loading developers...'}
                </p>
              </div>
            ) : developers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-center px-8 py-20">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {isSearching ? 'No developers found' : 'No developers available'}
                  </h3>
                  <p className="text-gray-400 max-w-md text-lg mb-4">
                    {isSearching 
                      ? `No developers match "${searchQuery}". Try a different search term.`
                      : 'Check back later for developer listings.'
                    }
                  </p>
                  {isSearching && (
                    <Button
                      variant="outline"
                      onClick={clearSearch}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-2 sm:p-4 w-full">
                {/* Results info */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {isSearching 
                      ? `Found ${totalResults} developer${totalResults !== 1 ? 's' : ''} matching "${searchQuery}"`
                      : `Showing ${totalResults} developer${totalResults !== 1 ? 's' : ''}`
                    }
                  </div>
                  {isSearching && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear search
                    </Button>
                  )}
                </div>

                {/* Developer Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
                  {developers.map((developer) => (
                    <DeveloperCard
                      key={developer.id || developer.developerId}
                      developer={developer}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 sm:px-4"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {/* Show fewer pages on mobile */}
                      {Array.from({ length: Math.min(window.innerWidth < 640 ? 3 : 5, totalPages) }, (_, i) => {
                        const maxVisible = window.innerWidth < 640 ? 3 : 5;
                        let pageNum;
                        if (totalPages <= maxVisible) {
                          pageNum = i + 1;
                        } else if (currentPage <= Math.ceil(maxVisible / 2)) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - Math.floor(maxVisible / 2)) {
                          pageNum = totalPages - maxVisible + 1 + i;
                        } else {
                          pageNum = currentPage - Math.floor(maxVisible / 2) + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0 sm:w-10 text-xs sm:text-sm"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 sm:px-4"
                    >
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
