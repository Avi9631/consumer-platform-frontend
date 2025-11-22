'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from "next/image";
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import map to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('../components/LocationMap'), { ssr: false });

// Property data (moved outside component to prevent re-creation)
const PROPERTIES_DATA = [
  {
    id: 1,
    name: 'Esto Arkis',
    location: 'Andheri West',
    lat: 19.1136,
    lng: 72.8697,
    price: '₹1.64 Cr - 3.84 Cr',
    bhk: '1, 2, 3 BHK',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=500&fit=crop',
    developer: 'ESTO GROUP'
  },
  {
    id: 2,
    name: 'Shree Gopaldham',
    location: 'Kandivali West',
    lat: 19.2074,
    lng: 72.8320,
    price: '₹3.45 Cr - 5.64 Cr',
    bhk: '3, 4 BHK',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=500&fit=crop',
    developer: 'JEEVEE'
  },
  {
    id: 3,
    name: 'Serenova Kolte Patil',
    location: 'Andheri West',
    lat: 19.1200,
    lng: 72.8600,
    price: '₹3.2 Cr - 4.93 Cr',
    bhk: '2, 3 BHK',
    image: 'https://images.unsplash.com/photo-1565402170291-8491f14678db?w=400&h=500&fit=crop',
    developer: 'KOLTE PATIL'
  },
  {
    id: 4,
    name: 'Raghav Ananta',
    location: 'Vikhroli',
    lat: 19.1107,
    lng: 72.9253,
    price: '₹1.1 Cr - 2.3 Cr',
    bhk: '1, 2, 3 BHK',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=500&fit=crop',
    developer: 'RAGHAV'
  },
  {
    id: 5,
    name: 'Shapoorji Minerva',
    location: 'Mahalaxmi',
    lat: 18.9826,
    lng: 72.8233,
    price: '₹14.22 Cr - 14.75 Cr',
    bhk: '3, 5, 4 BHK',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=500&fit=crop',
    developer: 'SHAPOORJI PALLONJI'
  },
  {
    id: 6,
    name: 'Peninsula Heights',
    location: 'Andheri West',
    lat: 19.1100,
    lng: 72.8750,
    price: '₹2.1 Cr - 3.5 Cr',
    bhk: '2, 3 BHK',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400&h=500&fit=crop',
    developer: 'PENINSULA'
  }
];

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState({
    city: 'Mumbai',
    lat: 19.0760,
    lng: 72.8777,
    name: 'Andheri West'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [hoveredTourId, setHoveredTourId] = useState(null);
  const videoRefs = useRef({});
  const carouselRef = useRef(null);

  const locations = [
    { name: 'Andheri West', lat: 19.1136, lng: 72.8697 },
    { name: 'Kandivali West', lat: 19.2074, lng: 72.8320 },
    { name: 'Mahalaxmi', lat: 18.9826, lng: 72.8233 },
    { name: 'Vikhroli', lat: 19.1107, lng: 72.9253 }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Handle video play/pause on hover
  const handleTourHover = (tourId, isHovering) => {
    setHoveredTourId(isHovering ? tourId : null);
    const video = videoRefs.current[tourId];
    if (video) {
      if (isHovering) {
        video.play().catch(e => console.log('Video play failed:', e));
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  // Scroll carousel
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const virtualTours = [
    {
      id: 1,
      title: 'SPACIOUS 3 BHK HOMES',
      price: '₹1.75 CR ONWARDS',
      location: 'Andheri West',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=700&fit=crop'
    },
    {
      id: 2,
      title: 'LUXURY APARTMENTS',
      price: '₹2.5 CR ONWARDS',
      location: 'Kandivali West',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=700&fit=crop'
    },
    {
      id: 3,
      title: 'PREMIUM 4 BHK',
      price: '₹3.2 CR ONWARDS',
      location: 'Mahalaxmi',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=700&fit=crop'
    },
    {
      id: 4,
      title: 'MODERN LIVING',
      price: '₹1.95 CR ONWARDS',
      location: 'Vikhroli',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=700&fit=crop'
    },
    {
      id: 5,
      title: 'SEA VIEW VILLAS',
      price: '₹5.2 CR ONWARDS',
      location: 'Mahalaxmi',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=700&fit=crop'
    },
    {
      id: 6,
      title: 'SMART HOMES',
      price: '₹2.8 CR ONWARDS',
      location: 'Andheri West',
      videoUrl: 'https://www.w3schools.com/html/movie.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=700&fit=crop'
    }
  ];

  // Filter properties based on selected location (5km radius)
  const filteredProperties = useMemo(() => {
    return PROPERTIES_DATA.filter(property => {
      const distance = calculateDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        property.lat,
        property.lng
      );
      return distance <= 5; // 5km radius
    });
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-black to-gray-950 text-white relative overflow-x-hidden">
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/90 backdrop-blur-xl shadow-[0_0_30px_rgba(251,146,60,0.25)] border-b border-orange-500/20' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl md:text-2xl font-bold hover:scale-105 transition-transform cursor-pointer">
            blo<span className="text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]">x</span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-full text-xs md:text-sm transition-all border border-orange-500/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden md:inline">Map View</span>
            </button>
            <button className="hover:text-orange-400 hover:scale-110 transition-all hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-semibold hover:scale-110 transition-transform hover:shadow-lg hover:shadow-orange-500/50">
              A
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=1080&fit=crop"
            alt="City skyline"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-orange-950/20 to-black/90"></div>
          <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 via-transparent to-orange-500/10"></div>
          {/* Sun glow effect */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl px-4"
          >
            Find your dream home<span className="text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]">.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-sm sm:text-base md:text-lg text-amber-100/90 mb-8 drop-shadow-lg px-4"
          >
            Location-based real estate marketplace • Select any area on map • 5km radius search
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-full flex flex-col sm:flex-row items-stretch sm:items-center overflow-hidden shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all"
          >
            <select
              value={selectedLocation.city}
              onChange={(e) => {
                const loc = locations.find(l => l.name === e.target.value);
                if (loc) {
                  setSelectedLocation({
                    city: selectedLocation.city,
                    lat: loc.lat,
                    lng: loc.lng,
                    name: loc.name
                  });
                }
              }}
              className="px-4 sm:px-6 py-3 sm:py-4 text-gray-800 bg-transparent sm:border-r border-b sm:border-b-0 border-gray-200 focus:outline-none cursor-pointer min-w-full sm:min-w-[150px]"
            >
              {locations.map(loc => (
                <option key={loc.name} value={loc.name}>{loc.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search Locations, Developers, Projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-gray-800 focus:outline-none text-sm sm:text-base"
            />
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/50">
              <span className="text-sm sm:text-base">Search</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </motion.div>

          {/* Location Pills */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6 px-4"
          >
            {locations.map((loc, index) => (
              <motion.button
                key={loc.name}
                variants={fadeInUp}
                transition={{ delay: 0.7 + index * 0.1 }}
                onClick={() => setSelectedLocation({
                  city: selectedLocation.city,
                  lat: loc.lat,
                  lng: loc.lng,
                  name: loc.name
                })}
                className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-all backdrop-blur-sm hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 ${
                  selectedLocation.name === loc.name
                    ? 'bg-orange-500/50 border-orange-400'
                    : 'bg-slate-800/60 hover:bg-orange-500/30 hover:border-orange-400/50'
                } border border-orange-500/20`}
              >
                {loc.name}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      {showMap && (
        <motion.section 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="py-8 md:py-12 bg-black relative"
        >
          {/* Section glow */}
          <div className="absolute inset-0 bg-linear-to-b from-orange-950/10 via-black to-orange-950/10 pointer-events-none"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                <span className="text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]">Select</span> Your Location
              </h2>
              <p className="text-amber-200/70 text-sm md:text-base">Click anywhere on the map to search properties within 5km radius</p>
            </div>
            <MapWithNoSSR 
              selectedLocation={selectedLocation}
              onLocationSelect={(loc) => setSelectedLocation({ ...selectedLocation, ...loc })}
              properties={filteredProperties}
            />
            <div className="mt-4 text-center text-sm text-gray-400">
              <p>Found <span className="text-orange-400 font-semibold">{filteredProperties.length}</span> properties within 5km of {selectedLocation.name}</p>
            </div>
          </div>
        </motion.section>
      )}

      {/* Virtual Tours Carousel Section */}
      <section className="py-12 md:py-16 bg-linear-to-b from-black via-orange-950/5 to-black overflow-hidden relative">
        {/* Radial glow effect */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs md:text-sm flex items-center gap-2 border border-orange-500/30 shadow-lg shadow-orange-500/20">
                ✨ New
              </span>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-linear-to-r from-white to-orange-200 bg-clip-text text-transparent">
                Virtual Property Tours
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 bg-slate-800/60 hover:bg-orange-500/30 rounded-full flex items-center justify-center transition-all border border-orange-500/20 hover:border-orange-400/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 bg-slate-800/60 hover:bg-orange-500/30 rounded-full flex items-center justify-center transition-all border border-orange-500/20 hover:border-orange-400/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Horizontal Scrollable Carousel */}
          <div 
            ref={carouselRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {virtualTours.map((tour) => (
              <motion.div 
                key={tour.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onMouseEnter={() => handleTourHover(tour.id, true)}
                onMouseLeave={() => handleTourHover(tour.id, false)}
                className="shrink-0 w-[280px] sm:w-[320px] md:w-[360px] group relative rounded-2xl overflow-hidden bg-linear-to-br from-slate-900 via-slate-900 to-orange-950/20 cursor-pointer transition-all duration-300 hover:shadow-[0_0_40px_rgba(251,146,60,0.4)] border border-orange-500/20 hover:border-orange-400/60"
              >
                <div className="relative aspect-9/16">
                  {/* Video element */}
                  <video
                    ref={(el) => (videoRefs.current[tour.id] = el)}
                    src={tour.videoUrl}
                    poster={tour.thumbnail}
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-orange-950/20 to-transparent"></div>
                  
                  {/* Play Indicator */}
                  {hoveredTourId !== tour.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-orange-500/40 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-125 transition-all shadow-[0_0_30px_rgba(251,146,60,0.6)] group-hover:shadow-[0_0_50px_rgba(251,146,60,0.8)]">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black via-orange-950/30 to-transparent">
                    <div className="bg-linear-to-r from-orange-400 to-amber-400 text-black px-3 py-1 rounded text-xs font-semibold inline-block mb-2 shadow-[0_0_15px_rgba(251,146,60,0.5)]">
                      {tour.title}
                    </div>
                    <p className="text-sm font-semibold text-orange-300 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]">{tour.price}</p>
                    <p className="text-xs text-amber-200/70 mt-1">📍 {tour.location}</p>
                  </div>
                  
                  {/* Hover to Play Text */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-orange-300 border border-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-orange-500/20">
                    {hoveredTourId === tour.id ? '▶ Playing' : '▶ Hover to play'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <p className="text-center text-sm text-gray-400 mt-4">
            Hover over videos to auto-play • Swipe to explore more
          </p>
        </div>
      </section>

      {/* Assured Properties Section */}
      <section className="py-12 md:py-16 bg-linear-to-b from-black via-orange-950/5 to-black relative">
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-orange-500/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.6)]">Blox</span> Assured Properties
            </h2>
            <p className="text-amber-200/70 text-sm md:text-base">
              {filteredProperties.length} properties near {selectedLocation.name} • Within 5km radius
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
          >
            {filteredProperties.length > 0 ? filteredProperties.map((property, index) => (
              <motion.div 
                key={property.id} 
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="group bg-linear-to-br from-slate-900 via-slate-900 to-orange-950/30 rounded-xl md:rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-orange-500/20 hover:border-orange-400/60 hover:shadow-[0_0_40px_rgba(251,146,60,0.4)]"
              >
                <div className="relative aspect-3/4 sm:aspect-4/5">
                  <Image
                    src={property.image}
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent"></div>
                  <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 flex justify-between items-start">
                    <div className="bg-white/95 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 rounded-lg shadow-lg">
                      <p className="text-[10px] md:text-xs font-semibold text-black">{property.developer}</p>
                    </div>
                    <div className="flex gap-1.5 md:gap-2">
                      <button className="w-8 h-8 md:w-10 md:h-10 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-500 transition-all hover:scale-110 hover:shadow-lg hover:shadow-orange-500/50">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 md:w-10 md:h-10 bg-slate-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-500 transition-all hover:scale-110 hover:shadow-lg hover:shadow-orange-500/50">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-linear-to-t from-black via-orange-950/40 to-transparent">
                    <h3 className="text-base md:text-xl font-bold mb-1 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]">{property.name}</h3>
                    <p className="text-xs md:text-sm text-amber-200/90 mb-2 drop-shadow-md">{property.location}</p>
                    <div className="flex justify-between items-end gap-2">
                      <div className="flex-1">
                        <p className="text-sm md:text-lg font-bold text-orange-300 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]">{property.price}</p>
                        <p className="text-xs md:text-sm text-gray-400">{property.bhk}</p>
                      </div>
                      <button className="px-3 md:px-4 py-1.5 md:py-2 bg-linear-to-r from-orange-500 to-orange-600 rounded-lg text-xs md:text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(251,146,60,0.6)] whitespace-nowrap">
                        BOOK VISIT
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12">
                <div className="inline-block p-6 bg-slate-900/50 rounded-2xl border border-orange-500/20">
                  <svg className="w-16 h-16 text-orange-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <h3 className="text-xl font-bold mb-2">No Properties Found</h3>
                  <p className="text-gray-400">Try selecting a different location or zoom out on the map</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
