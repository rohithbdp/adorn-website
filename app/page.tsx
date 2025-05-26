'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [typedText, setTypedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const typingTexts = [
    'Professional Photographer',
    'Event Specialist',
    'Memory Creator',
    'Visual Storyteller'
  ];

  // Gallery photos data
  const galleryPhotos = {
    weddings: [
      { src: '/gallery/weddings/wedding-1.jpg', alt: 'Wedding photo 1' },
      { src: '/gallery/weddings/wedding-2.jpg', alt: 'Wedding photo 2' },
      { src: '/gallery/weddings/wedding-3.jpg', alt: 'Wedding photo 3' },
      { src: '/gallery/weddings/wedding-4.jpg', alt: 'Wedding photo 4' },
      { src: '/gallery/weddings/wedding-5.jpg', alt: 'Wedding photo 5' },
      { src: '/gallery/weddings/wedding-6.jpg', alt: 'Wedding photo 6' },
    ],
    christening: [
      { src: '/gallery/christening/christening-1.jpg', alt: 'Christening photo 1' },
      { src: '/gallery/christening/christening-2.jpg', alt: 'Christening photo 2' },
      { src: '/gallery/christening/christening-3.jpg', alt: 'Christening photo 3' },
      { src: '/gallery/christening/christening-4.jpg', alt: 'Christening photo 4' },
    ],
    homeshoots: [
      { src: '/miriyala-family.jpg', alt: 'Miriyala Family' },
      { src: '/gallery/homeshoots/home-1.jpg', alt: 'Home shoot photo 1' },
      { src: '/gallery/homeshoots/home-2.jpg', alt: 'Home shoot photo 2' },
      { src: '/gallery/homeshoots/home-3.jpg', alt: 'Home shoot photo 3' },
      { src: '/gallery/homeshoots/home-4.jpg', alt: 'Home shoot photo 4' },
    ],
    babyshower: [
      { src: '/gallery/babyshower/babyshower-1.jpg', alt: 'Baby shower photo 1' },
      { src: '/gallery/babyshower/babyshower-2.jpg', alt: 'Baby shower photo 2' },
      { src: '/gallery/babyshower/babyshower-3.jpg', alt: 'Baby shower photo 3' },
      { src: '/gallery/babyshower/babyshower-4.jpg', alt: 'Baby shower photo 4' },
      { src: '/gallery/babyshower/babyshower-5.jpg', alt: 'Baby shower photo 5' },
    ],
    housewarming: [
      { src: '/gallery/housewarming/housewarming-1.jpg', alt: 'House warming photo 1' },
      { src: '/gallery/housewarming/housewarming-2.jpg', alt: 'House warming photo 2' },
      { src: '/gallery/housewarming/housewarming-3.jpg', alt: 'House warming photo 3' },
      { src: '/gallery/housewarming/housewarming-4.jpg', alt: 'House warming photo 4' },
    ],
  };

  useEffect(() => {
    const text = typingTexts[currentTextIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= text.length) {
        setTypedText(text.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentTextIndex]);

  return (
    <div className="min-h-screen relative bg-black text-gray-100">
      {/* Starry Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {[...Array(150)].map((_, i) => {
          // Use deterministic values based on index to avoid hydration mismatch
          const seed = i * 9.8;
          const width = ((seed % 15) / 10) + 0.5;
          const height = ((seed * 1.3 % 15) / 10) + 0.5;
          const left = (seed * 7.2) % 100;
          const top = (seed * 13.7) % 100;
          const delay = (seed % 50) / 10;
          const duration = ((seed % 30) / 10) + 2;
          
          return (
            <div
              key={i}
              className="absolute rounded-full animate-twinkle"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                left: `${left}%`,
                top: `${top}%`,
                backgroundColor: '#64ffda',
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`
              }}
            />
          );
        })}
      </div>

      {/* Gallery View Modal */}
      {selectedGallery && (
        <div className="fixed inset-0 z-[60] bg-black/90 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold capitalize">
                {selectedGallery === 'homeshoots' ? 'Home Shoots' : selectedGallery} Gallery
              </h2>
              <button
                onClick={() => setSelectedGallery(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {galleryPhotos[selectedGallery as keyof typeof galleryPhotos]?.map((photo, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Fallback images based on category
                      const fallbacks: Record<string, string> = {
                        weddings: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
                        christening: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
                        homeshoots: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                        babyshower: 'https://images.unsplash.com/photo-1549831243-a69715b24f78?w=800',
                        housewarming: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
                      };
                      target.src = fallbacks[selectedGallery] || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logo above navigation */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 pt-3">
        <img 
          src="/adorn-logo.png" 
          alt="aDorn Logo" 
          className="h-10 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-16 w-full z-50 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-cyan-400 text-base sm:text-xl logo-text">
            aDorn<span className="hidden sm:inline"> Photography & Event Rentals LLC</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#hero" className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Gallery</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Services</a>
            <a href="#testimonials" className="hover:text-cyan-400 transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-cyan-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-black/95 backdrop-blur-sm rounded-lg p-4">
            <div className="flex flex-col space-y-4">
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 transition-colors">Home</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 transition-colors">About</a>
              <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 transition-colors">Gallery</a>
              <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 transition-colors">Services</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 transition-colors">Testimonials</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center px-6 relative pt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="animate-fadeInLeft">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Hi! I'm David.
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-2">
              A passionate <span className="text-cyan-400">{typedText}</span>
              <span className="animate-pulse">|</span>
            </p>
            <p className="text-gray-400 mb-8">
              Capturing life's precious moments through creative lens work and professional event services.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <a href="#projects" className="px-6 py-3 bg-cyan-400 text-black font-medium hover:bg-cyan-300 transition-colors">
                VIEW MY WORK
              </a>
              <a href="#contact" className="px-6 py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all">
                BOOK SESSION
              </a>
            </div>

            <div className="flex space-x-4">
              <a href="https://www.instagram.com/adorn_david" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
                  <circle cx="18.406" cy="5.594" r="1.44" />
                </svg>
              </a>
              <a href="https://www.facebook.com/adornfotography" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="mailto:adornphoto.eventrentals@gmail.com" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a href="https://wa.me/14806690200" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="animate-fadeInRight flex justify-center mt-8 md:mt-0">
            <div className="relative">
              <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 hexagon bg-cyan-400 p-1">
                <div className="w-full h-full hexagon bg-black p-2">
                  <img
                    src="/photographer-profile.jpg"
                    alt="David - Professional Photographer"
                    className="w-full h-full object-cover hexagon"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-2">About Me</h2>
          <div className="w-20 h-1 bg-cyan-400 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <img
                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400"
                alt="Photography Equipment"
                className="rounded-lg w-full"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <p className="text-gray-300">
                I am a professional photographer dedicated to capturing the essence of life's most precious
                moments. From intimate family gatherings to grand wedding celebrations, I bring a unique
                blend of technical expertise and artistic vision.
              </p>
              <p className="text-gray-300">
                As the founder of aDorn Photography & Event Rentals LLC, I not only provide photography
                services but also comprehensive event solutions including photo booths, lighting, and décor
                to ensure your special occasions are perfectly documented and beautifully presented.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="text-cyan-400 text-3xl mb-2">📸</div>
                  <h3 className="font-semibold">Photography</h3>
                  <p className="text-sm text-gray-400">Professional Services</p>
                </div>
                <div className="text-center">
                  <div className="text-cyan-400 text-3xl mb-2">🎪</div>
                  <h3 className="font-semibold">Events</h3>
                  <p className="text-sm text-gray-400">Complete Solutions</p>
                </div>
                <div className="text-center">
                  <div className="text-cyan-400 text-3xl mb-2">🎨</div>
                  <h3 className="font-semibold">Creative</h3>
                  <p className="text-sm text-gray-400">Artistic Vision</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-2">Gallery</h2>
          <div className="w-20 h-1 bg-cyan-400 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Project 1 */}
            <div 
              onClick={() => setSelectedGallery('weddings')}
              className="bg-gradient-to-br from-purple-900/20 to-purple-600/20 border border-purple-500/20 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
              <img
                src="/gallery/weddings/wedding-1.jpg"
                alt="Wedding Photography"
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Wedding</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  A stunning sunset ceremony capturing the love and joy of Fiona & Bonnell's special day.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">Wedding</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">Beach</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">Sunset</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGallery('weddings');
                    }}
                    className="text-cyan-400 hover:text-cyan-300 text-sm">VIEW GALLERY</button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="text-cyan-400 hover:text-cyan-300 text-sm">DETAILS</button>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div 
              onClick={() => setSelectedGallery('christening')}
              className="bg-gradient-to-br from-cyan-900/20 to-cyan-600/20 border border-cyan-500/20 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
              <img
                src="/gallery/christening/christening-1.jpg"
                alt="Christening Photography"
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Christening</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Sacred moments beautifully preserved during this traditional ceremony.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">Christening</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">Church</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">Family</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGallery('christening');
                    }}
                    className="text-cyan-400 hover:text-cyan-300 text-sm">VIEW GALLERY</button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="text-cyan-400 hover:text-cyan-300 text-sm">DETAILS</button>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div 
              onClick={() => setSelectedGallery('homeshoots')}
              className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
              <img
                src="/miriyala-family.jpg"
                alt="Miriyala Family Portrait"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Miriyala Family Session</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Authentic family moments captured in the comfort of their beautiful home.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">Family</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">Home</span>
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded">Lifestyle</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGallery('homeshoots');
                    }}
                    className="text-cyan-400 hover:text-cyan-300 text-sm">VIEW GALLERY</button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="text-cyan-400 hover:text-cyan-300 text-sm">DETAILS</button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Gallery Items - Show when expanded */}
          {showFullGallery && (
            <div className="grid md:grid-cols-3 gap-6 mt-6 animate-fadeIn">
              {/* Baby Shower */}
              <div 
                onClick={() => setSelectedGallery('babyshower')}
                className="bg-gradient-to-br from-pink-900/20 to-pink-600/20 border border-pink-500/20 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                <img
                  src="/gallery/babyshower/babyshower-1.jpg"
                  alt="Baby Shower Photography"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1549831243-a69715b24f78?w=800';
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Baby Shower</h3>
                  <p className="text-gray-400 mb-4 text-sm">
                    Celebrating new beginnings with joy, laughter, and precious moments.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded">Baby Shower</span>
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded">Celebration</span>
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded">Family</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGallery('babyshower');
                      }}
                      className="text-cyan-400 hover:text-cyan-300 text-sm">VIEW GALLERY</button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="text-cyan-400 hover:text-cyan-300 text-sm">DETAILS</button>
                  </div>
                </div>
              </div>

              {/* House Warming */}
              <div 
                onClick={() => setSelectedGallery('housewarming')}
                className="bg-gradient-to-br from-orange-900/20 to-orange-600/20 border border-orange-500/20 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                <img
                  src="/gallery/housewarming/housewarming-1.jpg"
                  alt="House Warming Photography"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800';
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">House Warming</h3>
                  <p className="text-gray-400 mb-4 text-sm">
                    Capturing the warmth and happiness of your new home celebrations.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded">House Warming</span>
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded">New Home</span>
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded">Celebration</span>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGallery('housewarming');
                      }}
                      className="text-cyan-400 hover:text-cyan-300 text-sm">VIEW GALLERY</button>
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="text-cyan-400 hover:text-cyan-300 text-sm">DETAILS</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <button 
              onClick={() => setShowFullGallery(!showFullGallery)}
              className="inline-block px-6 py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all">
              {showFullGallery ? 'SHOW LESS' : 'SEE ALL GALLERIES'}
            </button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-2">Services & Skills</h2>
          <div className="w-20 h-1 bg-cyan-400 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Photography</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-sm">Weddings</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">👶</div>
                  <p className="text-sm">Baby Showers</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">✝️</div>
                  <p className="text-sm">Christening</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🏠</div>
                  <p className="text-sm">Home Shoots</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Equipment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm">Canon Pro</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">💡</div>
                  <p className="text-sm">Studio Lights</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🚁</div>
                  <p className="text-sm">Drone</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-sm">Video Gear</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Event Rentals</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm">Photo Booths</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎭</div>
                  <p className="text-sm">Props</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎨</div>
                  <p className="text-sm">Backdrops</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎪</div>
                  <p className="text-sm">Decor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 relative bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-2">Client Testimonials</h2>
          <div className="w-20 h-1 bg-cyan-400 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-cyan-400 transition-colors">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "David captured our wedding beautifully! His attention to detail and ability to capture
                candid moments made our special day even more memorable. Highly recommend!"
              </p>
              <div>
                <p className="font-semibold">Fiona & Bonnell</p>
                <p className="text-sm text-gray-400">Wedding Photography</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-cyan-400 transition-colors">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "The photo booth rental was a huge hit at our baby shower! David's team was professional,
                and the quality of photos was outstanding. Will definitely use again!"
              </p>
              <div>
                <p className="font-semibold">Rohith</p>
                <p className="text-sm text-gray-400">Baby Shower Event</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-cyan-400 transition-colors">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "David photographed our daughter's christening with such grace and respect. He captured
                the sacred moments perfectly while being unobtrusive. Truly professional!"
              </p>
              <div>
                <p className="font-semibold">The Miriyala Family</p>
                <p className="text-sm text-gray-400">Christening Photography</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Join hundreds of satisfied clients</p>
            <a href="#contact" className="inline-block px-6 py-3 bg-cyan-400 text-black font-medium hover:bg-cyan-300 transition-colors">
              BOOK YOUR SESSION
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-2">Get In Touch</h2>
          <div className="w-20 h-1 bg-cyan-400 mx-auto mb-12"></div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-4 break-all">adornphoto.eventrentals@gmail.com</p>
              <a href="mailto:adornphoto.eventrentals@gmail.com" className="inline-block px-4 py-2 bg-cyan-400 text-black text-sm font-medium hover:bg-cyan-300 transition-colors">
                SEND EMAIL
              </a>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-sm text-gray-400 mb-4">(480) 669-0200</p>
              <a href="tel:4806690200" className="inline-block px-4 py-2 bg-cyan-400 text-black text-sm font-medium hover:bg-cyan-300 transition-colors">
                CALL NOW
              </a>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center hover:border-cyan-400 transition-colors">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-sm text-gray-400 mb-4">Gilbert, Arizona</p>
              <a href="#" className="inline-block px-4 py-2 bg-cyan-400 text-black text-sm font-medium hover:bg-cyan-300 transition-colors">
                GET DIRECTIONS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <a href="https://www.instagram.com/adorn_david" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
                <circle cx="18.406" cy="5.594" r="1.44" />
              </svg>
            </a>
            <a href="https://www.facebook.com/adornfotography" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="https://wa.me/14806690200" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 aDorn Photography & Event Rentals LLC. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">We Create Your Memory Banks</p>
        </div>
      </footer>
    </div>
  );
}