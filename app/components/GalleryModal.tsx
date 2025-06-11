'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { getGalleryAltText } from '../utils/galleryHelpers';

interface GalleryModalProps {
  selectedGallery: string;
  galleryData: any;
  currentImageIndex: number;
  imageZoom: boolean;
  setSelectedGallery: (gallery: string | null) => void;
  setCurrentImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setImageZoom: (zoom: boolean) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export default function GalleryModal({
  selectedGallery,
  galleryData,
  currentImageIndex,
  imageZoom,
  setSelectedGallery,
  setCurrentImageIndex,
  setImageZoom,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
}: GalleryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus modal on mount for keyboard navigation
    modalRef.current?.focus();
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/90 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-title"
      ref={modalRef}
      tabIndex={-1}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex justify-between items-center mb-4 sm:mb-8">
          <h2 id="gallery-title" className="text-xl sm:text-2xl md:text-3xl font-bold">
            {selectedGallery === 'firstbirthday' ? '1st Birthday' :
             selectedGallery === 'musicconcert' ? 'Music Concert' :
             selectedGallery === 'familysession' ? 'Family Session' :
             selectedGallery === 'housewarming' ? 'House Warming' :
             selectedGallery === 'maternity' ? 'Maternity' :
             selectedGallery === 'newborn' ? 'Newborn' :
             selectedGallery === 'portraits' ? 'Portraits' :
             selectedGallery === 'wedding' ? 'Wedding' : ''} Gallery
          </h2>
          <button
            onClick={() => {
              setSelectedGallery(null);
              setCurrentImageIndex(0);
              setImageZoom(false);
            }}
            className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black rounded-sm p-1"
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Enhanced Gallery View */}
        {imageZoom ? (
          <div className="relative">
            <button
              onClick={() => setImageZoom(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Exit zoom mode"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>
            <img
              src={galleryData[selectedGallery][currentImageIndex].src}
              alt={getGalleryAltText(selectedGallery, currentImageIndex)}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          </div>
        ) : (
          <div>
            {/* Main Image Display */}
            <div className="relative mb-6">
              <img
                src={galleryData[selectedGallery][currentImageIndex].src}
                alt={getGalleryAltText(selectedGallery, currentImageIndex)}
                className="w-full h-auto max-h-[60vh] cursor-zoom-in object-contain"
                onClick={() => setImageZoom(true)}
              />
              
              {/* Navigation Arrows */}
              {galleryData[selectedGallery].length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev: number) => (prev - 1 + galleryData[selectedGallery].length) % galleryData[selectedGallery].length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev: number) => (prev + 1) % galleryData[selectedGallery].length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1 sm:gap-2">
              {galleryData[selectedGallery]?.map((photo: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    index === currentImageIndex ? 'ring-2 ring-cyan-400' : ''
                  }`}
                  aria-label={`View image ${index + 1} of ${galleryData[selectedGallery].length}`}
                >
                  <img
                    src={photo.src}
                    alt={getGalleryAltText(selectedGallery, index)}
                    className={`w-full h-full object-cover hover:scale-110 transition-transform duration-300 ${
                      selectedGallery === 'familysession' && index === 3
                        ? 'object-[center_25%]'
                        : ''
                    }`}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
            
            {/* Image Counter and Instructions */}
            <div className="mt-4 text-center text-gray-400">
              <p className="text-sm sm:text-base mb-2">
                Image {currentImageIndex + 1} of {galleryData[selectedGallery].length}
              </p>
              <p className="text-xs sm:text-sm hidden sm:block">
                Use arrow keys to navigate • Press Space or Enter to zoom • Press Escape to close
              </p>
              <p className="text-xs sm:hidden">
                Swipe to navigate • Tap to zoom
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}