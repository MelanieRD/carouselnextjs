'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface CarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
  initialSlide?: number;
  showModal?: boolean;
  onClose?: () => void;
}

export default function Carousel({ 
  images, 
  autoPlay = true, 
  interval = 5000,
  initialSlide = 0,
  showModal = false,
  onClose
}: CarouselProps) {
  // If there are no images, don't render anything
  if (!images || images.length === 0) {
    return null;
  }

  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentSlide(initialSlide);
  }, [initialSlide]);

  const scrollThumbnailIntoView = useCallback((index: number) => {
    const thumbnail = thumbnailRefs.current[index];
    const container = thumbnailContainerRef.current;
    
    if (thumbnail && container) {
      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = thumbnail.getBoundingClientRect();
      
      // Calculate the scroll position to center the thumbnail
      const scrollLeft = thumbnail.offsetLeft - (containerRect.width / 2) + (thumbnailRect.width / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, []);

  const nextSlide = useCallback(() => {
    const newIndex = (currentSlide + 1) % images.length;
    setCurrentSlide(newIndex);
    scrollThumbnailIntoView(newIndex);
  }, [currentSlide, images.length, scrollThumbnailIntoView]);

  const prevSlide = useCallback(() => {
    const newIndex = (currentSlide - 1 + images.length) % images.length;
    setCurrentSlide(newIndex);
    scrollThumbnailIntoView(newIndex);
  }, [currentSlide, images.length, scrollThumbnailIntoView]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [isAutoPlaying, interval, nextSlide]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(autoPlay);
  
  const handleModalClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop (not the carousel content)
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentSlide(index);
    scrollThumbnailIntoView(index);
  };

  const carouselContent = (
    <div 
      className="relative w-full max-w-6xl mx-auto bg-white rounded-lg border border-gray-300 shadow p-10 flex flex-col items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
          onClick={onClose}
          className="absolute -top-1 right-0 p-5 sm:p-4 md:p-2 text-gray-900 hover:text-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 sm:h-5 sm:w-5 md:h-7 md:w-7 lg:h-9 lg:w-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      
      {/* Main Slide Area */}
      <div className="relative w-full max-w-[900px] flex justify-center items-center mb-0">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[9/5] lg:aspect-[16/9] rounded-lg border border-gray-300 bg-white overflow-hidden flex items-center justify-center">
          <Image
            src={images[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[calc(95%)] flex justify-between items-center pointer-events-none">
        <button
          onClick={prevSlide}
          className="bg-white border border-gray-300 text-blue-600 p-1.5 sm:p-2 md:p-3 rounded-full shadow-sm hover:bg-blue-50 transition-all z-10 pointer-events-auto"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="bg-white border border-gray-300 text-blue-600 p-1.5 sm:p-2 md:p-3 rounded-full shadow-sm hover:bg-blue-50 transition-all z-10 pointer-events-auto"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="w-full max-w-[900px] mt-4 sm:mt-6 md:mt-8 mb-1 sm:mb-2">
          <div 
            ref={thumbnailContainerRef}
            className="flex space-x-4 overflow-x-auto py-1 sm:py-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {images.map((image, index) => (
              <button
                key={index}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-8 h-8 sm:h-10 sm:w-10 md:h-20 md:w-20 lg:h-20 lg:w-20 rounded-lg border border-gray-300 overflow-hidden transition-all bg-white shadow-sm ${
                  currentSlide === index ? 'ring-2 ring-blue-600 border-blue-600 scale-105 z-10' : 'opacity-70 hover:opacity-100'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (showModal) {
    return (
      <div 
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        onClick={handleModalClick}
      >
        <div className="relative w-full max-w-6xl mx-auto">
          {carouselContent}
        </div>
      </div>
    );
  }

  return carouselContent;
} 