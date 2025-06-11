'use client';

import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import Image from 'next/image';
import { getGalleryAltText, getCategoryDescription } from './utils/galleryHelpers';
import { GallerySkeleton, ImageSkeleton } from './components/SkeletonLoader';
import MobileMenu from './components/MobileMenu';

// Dynamic import for gallery modal
const GalleryModal = lazy(() => import('./components/GalleryModal'));

const basePath = process.env.NODE_ENV === 'production' ? '/adorn-website' : '';

export default function Home() {
  const [typedText, setTypedText] = useState('Professional Photographer');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<string | null>(null);
  const [galleryData, setGalleryData] = useState<any>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(false);
  const galleryModalRef = useRef<HTMLDivElement>(null);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: '',
    preferredContact: 'email'
  });

  const typingTexts = [
    'Professional Photographer',
    'Event Specialist',
    'Memory Creator',
    'Visual Storyteller'
  ];

  useEffect(() => {
    const text = typingTexts[currentTextIndex];
    let charIndex = 0;
    
    // Reset to empty before typing new text
    setTypedText('');
    
    // Small delay before starting to type
    const startDelay = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex <= text.length) {
          setTypedText(text.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          // Wait before moving to next text
          setTimeout(() => {
            setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
          }, 2000);
        }
      }, 100);
      
      // Store interval ID for cleanup
      return () => clearInterval(typeInterval);
    }, 100);

    return () => {
      clearTimeout(startDelay);
    };
  }, [currentTextIndex]);

  // Load gallery data
  useEffect(() => {
    setLoadingGallery(true);
    fetch(`${basePath}/gallery/manifest.json`)
      .then(res => res.json())
      .then(data => {
        // Add base path to all image URLs in production
        if (basePath) {
          const updatedData: any = {};
          Object.keys(data).forEach(category => {
            updatedData[category] = data[category].map((item: any) => ({
              ...item,
              src: `${basePath}${item.src}`,
              webp: item.webp ? `${basePath}${item.webp}` : undefined
            }));
          });
          setGalleryData(updatedData);
        } else {
          setGalleryData(data);
        }
        setLoadingGallery(false);
      })
      .catch(err => {
        console.error('Error loading gallery:', err);
        setLoadingGallery(false);
      });
  }, []);

  // Handle form submission with Formspree
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('https://formspree.io/f/movwdjwl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventType: formData.eventType,
          message: formData.message,
          preferredContact: formData.preferredContact,
          _subject: `New inquiry from ${formData.name} - ${formData.eventType}`
        }),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          message: '',
          preferredContact: 'email'
        });
      } else {
        setSubmitStatus('error');
        console.error('Form submission error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle keyboard navigation for gallery
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedGallery || !galleryData[selectedGallery]) return;
    
    const images = galleryData[selectedGallery];
    
    switch (e.key) {
      case 'ArrowLeft':
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        break;
      case 'ArrowRight':
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        break;
      case 'Escape':
        setSelectedGallery(null);
        setCurrentImageIndex(0);
        setImageZoom(false);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        setImageZoom(!imageZoom);
        break;
    }
  }, [selectedGallery, galleryData, imageZoom]);

  // Add keyboard event listener for gallery navigation
  useEffect(() => {
    if (selectedGallery) {
      window.addEventListener('keydown', handleKeyDown);
      // Focus the modal for keyboard navigation
      galleryModalRef.current?.focus();
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedGallery, handleKeyDown]);

  // Handle swipe gestures for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedGallery && galleryData[selectedGallery]) {
      setCurrentImageIndex((prev) => (prev + 1) % galleryData[selectedGallery].length);
    }
    if (isRightSwipe && selectedGallery && galleryData[selectedGallery]) {
      setCurrentImageIndex((prev) => (prev - 1 + galleryData[selectedGallery].length) % galleryData[selectedGallery].length);
    }
  };

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

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} basePath={basePath} />
      
      {/* Gallery View Modal */}
      {selectedGallery && galleryData[selectedGallery] && (
        <Suspense fallback={
          <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center">
            <div className="text-white">Loading gallery...</div>
          </div>
        }>
          <GalleryModal
            selectedGallery={selectedGallery}
            galleryData={galleryData}
            currentImageIndex={currentImageIndex}
            imageZoom={imageZoom}
            setSelectedGallery={setSelectedGallery}
            setCurrentImageIndex={setCurrentImageIndex}
            setImageZoom={setImageZoom}
            handleTouchStart={handleTouchStart}
            handleTouchMove={handleTouchMove}
            handleTouchEnd={handleTouchEnd}
          />
        </Suspense>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-4 sm:px-6 py-4 bg-black/50 backdrop-blur-sm" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left side - Company name */}
          <div className="text-cyan-400 text-base sm:text-xl logo-text">
            <span className="sr-only">aDorn Photography & Event Rentals LLC</span>
            <span aria-hidden="true">aDorn<span className="hidden sm:inline"> Photography & Event Rentals LLC</span></span>
          </div>
          
          {/* Center - Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Image
              src={`${basePath}/adorn-logo-white.png`} 
              alt="aDorn Photography & Event Rentals - Professional photography services in Gilbert, Arizona" 
              width={48}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </div>
          
          {/* Right side - Navigation */}
          <nav className="hidden md:flex space-x-8" role="navigation" aria-label="Primary navigation">
            <a href="#hero" className="hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1">Home</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1">About</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1">Gallery</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1">Services</a>
            <a href="#testimonials" className="hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1">Testimonials</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm px-1">Contact</a>
          </nav>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm p-1"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
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
      <section id="hero" className="min-h-screen flex items-center px-4 sm:px-6 relative pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center w-full">
          <div className="animate-fadeInLeft">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Hi! I'm David.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-2">
              A passionate <span className="text-cyan-400 block sm:inline-block sm:min-w-[280px] md:min-w-[350px]">{typedText}</span>
            </p>
            <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">
              Capturing life's precious moments through creative lens work and professional event services.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <a href="#projects" className="px-4 sm:px-6 py-2.5 sm:py-3 bg-cyan-400 text-black font-medium hover:bg-cyan-300 transition-colors text-center text-sm sm:text-base">
                VIEW MY WORK
              </a>
              <a href="#contact" className="px-4 sm:px-6 py-2.5 sm:py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all text-center text-sm sm:text-base">
                BOOK SESSION
              </a>
            </div>

            <div className="flex space-x-4" role="list" aria-label="Social media links">
              <a href="https://www.instagram.com/adorn_david" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm p-1" aria-label="Follow aDorn Photography on Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                  <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
                  <circle cx="18.406" cy="5.594" r="1.44" />
                </svg>
              </a>
              <a href="https://www.facebook.com/adornfotography" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm p-1" aria-label="Follow aDorn Photography on Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="mailto:adornphoto.eventrentals@gmail.com" className="text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm p-1" aria-label="Email aDorn Photography">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a href="https://wa.me/14806690200" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm p-1" aria-label="Contact aDorn Photography on WhatsApp">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="animate-fadeInRight flex justify-center mt-6 sm:mt-8 md:mt-0">
            <div className="relative">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 hexagon bg-cyan-400 p-1">
                <div className="w-full h-full hexagon bg-black p-1 sm:p-2">
                  <div className="relative w-full h-full hexagon overflow-hidden">
                    <Image
                      src={`${basePath}/photographer-profile.jpg`}
                      alt="David - Professional Photographer specializing in weddings, maternity, and family portraits"
                      fill
                      sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, (max-width: 1024px) 256px, 320px"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">About Me</h2>
          <div className="w-16 sm:w-20 h-1 bg-cyan-400 mx-auto mb-8 sm:mb-12"></div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 items-center">
            <div className="md:col-span-1 order-2 md:order-1">
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400"
                  alt="Professional photography equipment including cameras, lenses, and lighting gear"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-3 sm:space-y-4 order-1 md:order-2">
              <p className="text-sm sm:text-base text-gray-300">
                I am a professional photographer dedicated to capturing the essence of life's most precious
                moments. From intimate family gatherings to grand wedding celebrations, I bring a unique
                blend of technical expertise and artistic vision.
              </p>
              <p className="text-sm sm:text-base text-gray-300">
                As the founder of aDorn Photography & Event Rentals LLC, I not only provide photography
                services but also comprehensive event solutions including photo booths, lighting, and décor
                to ensure your special occasions are perfectly documented and beautifully presented.
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
                <div className="text-center">
                  <div className="text-cyan-400 text-2xl sm:text-3xl mb-1 sm:mb-2">📸</div>
                  <h3 className="text-sm sm:text-base font-semibold">Photography</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Professional Services</p>
                </div>
                <div className="text-center">
                  <div className="text-cyan-400 text-2xl sm:text-3xl mb-1 sm:mb-2">🎪</div>
                  <h3 className="text-sm sm:text-base font-semibold">Events</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Complete Solutions</p>
                </div>
                <div className="text-center">
                  <div className="text-cyan-400 text-2xl sm:text-3xl mb-1 sm:mb-2">🎨</div>
                  <h3 className="text-sm sm:text-base font-semibold">Creative</h3>
                  <p className="text-xs sm:text-sm text-gray-400">Artistic Vision</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 sm:py-20 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">Gallery</h2>
          <div className="w-16 sm:w-20 h-1 bg-cyan-400 mx-auto mb-8 sm:mb-12"></div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {/* Gallery Categories */}
            {[
              { id: 'firstbirthday', name: '1st Birthday', icon: '🎂', color: 'pink', desc: 'Magical first birthday celebrations captured forever.' },
              { id: 'musicconcert', name: 'Music Concert', icon: '🎵', color: 'purple', desc: 'Live performances and musical moments in stunning detail.' },
              { id: 'familysession', name: 'Family Session', icon: '👨‍👩‍👧‍👦', color: 'blue', desc: 'Authentic family moments captured in natural settings.' },
              { id: 'housewarming', name: 'House Warming', icon: '🏠', color: 'orange', desc: 'Celebrating new beginnings in your dream home.' },
              { id: 'maternity', name: 'Maternity', icon: '🤰', color: 'rose', desc: 'Beautiful maternity portraits celebrating motherhood.' },
              { id: 'newborn', name: 'Newborn', icon: '👶', color: 'yellow', desc: 'Precious first moments of your little one\'s journey.' },
              { id: 'portraits', name: 'Portraits', icon: '🎨', color: 'teal', desc: 'Professional portraits that capture your unique essence.' },
              { id: 'wedding', name: 'Wedding', icon: '💒', color: 'red', desc: 'Your love story captured in timeless wedding photography.' }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedGallery(category.id);
                  setCurrentImageIndex(0);
                }}
                className={`rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black text-left w-full ${
                  category.color === 'pink' ? 'bg-gradient-to-br from-pink-900/20 to-pink-600/20 border border-pink-500/20' :
                  category.color === 'purple' ? 'bg-gradient-to-br from-purple-900/20 to-purple-600/20 border border-purple-500/20' :
                  category.color === 'blue' ? 'bg-gradient-to-br from-blue-900/20 to-blue-600/20 border border-blue-500/20' :
                  category.color === 'orange' ? 'bg-gradient-to-br from-orange-900/20 to-orange-600/20 border border-orange-500/20' :
                  category.color === 'rose' ? 'bg-gradient-to-br from-rose-900/20 to-rose-600/20 border border-rose-500/20' :
                  category.color === 'yellow' ? 'bg-gradient-to-br from-yellow-900/20 to-yellow-600/20 border border-yellow-500/20' :
                  category.color === 'teal' ? 'bg-gradient-to-br from-teal-900/20 to-teal-600/20 border border-teal-500/20' :
                  category.color === 'red' ? 'bg-gradient-to-br from-red-900/20 to-red-600/20 border border-red-500/20' :
                  'bg-gradient-to-br from-gray-900/20 to-gray-600/20 border border-gray-500/20'
                }`}
              >
                <div className="aspect-video bg-gray-800 overflow-hidden">
                  {loadingGallery ? (
                    <div className="flex items-center justify-center h-full bg-gray-800 animate-pulse">
                      <span className="text-4xl opacity-50">{category.icon}</span>
                    </div>
                  ) : galleryData[category.id] && galleryData[category.id][0] ? (
                    <img
                      src={galleryData[category.id][0].src}
                      alt={getGalleryAltText(category.id, 0)}
                      className={`w-full h-full object-cover ${
                        (category.id === 'maternity' || category.id === 'portraits') ? 'object-[center_25%]' : 
                        category.id === 'familysession' ? 'object-[center_75%]' : 
                        'object-center'
                      }`}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-4xl">{category.icon}</span>
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4 md:p-6">
                  <h3 className="text-sm sm:text-base md:text-xl font-semibold mb-1 sm:mb-2">{category.name}</h3>
                  <p className="text-gray-400 mb-2 sm:mb-4 text-xs sm:text-sm hidden sm:block">{category.desc}</p>
                  <span className="text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm" role="text">
                    {loadingGallery ? (
                      <span className="inline-block h-4 w-20 bg-gray-800 rounded animate-pulse"></span>
                    ) : galleryData[category.id] ? (
                      `VIEW ${galleryData[category.id].length} PHOTO${galleryData[category.id].length !== 1 ? 'S' : ''}`
                    ) : (
                      'NO PHOTOS'
                    )}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <p className="text-sm sm:text-base text-gray-400 mb-4">Click on any gallery to view photos</p>
            <a href="#contact" className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-cyan-400 text-black font-medium hover:bg-cyan-300 transition-colors text-sm sm:text-base">
              BOOK YOUR SESSION
            </a>
          </div>

        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 sm:py-20 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">Services & Skills</h2>
          <div className="w-16 sm:w-20 h-1 bg-cyan-400 mx-auto mb-8 sm:mb-12"></div>

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
      <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">Get In Touch</h2>
          <div className="w-16 sm:w-20 h-1 bg-cyan-400 mx-auto mb-8 sm:mb-12"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 text-center hover:border-cyan-400 transition-colors">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📧</div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 break-all">adornphoto.eventrentals@gmail.com</p>
              <a href="mailto:adornphoto.eventrentals@gmail.com" className="inline-block px-3 sm:px-4 py-2 bg-cyan-400 text-black text-xs sm:text-sm font-medium hover:bg-cyan-300 transition-colors">
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
              <p className="text-sm text-gray-400">Gilbert, Arizona</p>
              <div className="mt-4 space-y-1">
                <p className="text-xs text-gray-500">Business Hours:</p>
                <p className="text-xs text-gray-400">Mon-Fri: 9AM - 6PM</p>
                <p className="text-xs text-gray-400">Sat-Sun: 10AM - 7PM</p>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-400 mt-8 mb-12">
            <span className="text-cyan-400">✉️</span> We typically respond within 24 hours
          </p>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto mt-12">
            <h3 className="text-2xl font-semibold text-center mb-8">Send Us a Message</h3>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="eventType" className="block text-sm font-medium text-gray-300 mb-2">
                    Event Type *
                  </label>
                  <input
                    type="text"
                    id="eventType"
                    name="eventType"
                    required
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="e.g., Wedding, Birthday, Corporate Event"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Contact Method
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={formData.preferredContact === 'email'}
                      onChange={handleInputChange}
                      className="mr-2 text-cyan-400"
                    />
                    <span className="text-sm">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={formData.preferredContact === 'phone'}
                      onChange={handleInputChange}
                      className="mr-2 text-cyan-400"
                    />
                    <span className="text-sm">Phone</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="whatsapp"
                      checked={formData.preferredContact === 'whatsapp'}
                      onChange={handleInputChange}
                      className="mr-2 text-cyan-400"
                    />
                    <span className="text-sm">WhatsApp</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your event and what you're looking for..."
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-cyan-400 text-black font-medium hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
                
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-900/20 border border-green-500/20 rounded-lg text-green-400" role="alert">
                    <p className="font-medium">Thank you for your inquiry!</p>
                    <p className="text-sm mt-1">We'll get back to you within 24 hours.</p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-red-400" role="alert">
                    <p className="font-medium">Oops! Something went wrong.</p>
                    <p className="text-sm mt-1">Please try again or contact us directly at adornphoto.eventrentals@gmail.com</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <a href="https://www.instagram.com/adorn_david" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4z" />
                <circle cx="18.406" cy="5.594" r="1.44" />
              </svg>
            </a>
            <a href="https://www.facebook.com/adornfotography" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
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