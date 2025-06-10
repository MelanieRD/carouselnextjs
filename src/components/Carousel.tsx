'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Cambia la interfaz para aceptar la nueva estructura
interface MediaImage {
  label: string;
  url: string;
}

interface Media {
  [category: string]: MediaImage[];
}

interface CarouselProps {
  media: Media; // Cambiado de images: string[]
  autoPlay?: boolean;
  interval?: number;
  initialSlide?: number;
  showModal?: boolean;
  onClose?: () => void;
}

export default function Carousel({ 
  media, 
  autoPlay = true, 
  interval = 5000,
  initialSlide = 0,
  showModal = false,
  onClose
}: CarouselProps) {
  // Obtén las categorías y la primera como default
  const categories = Object.keys(media || {});
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const images = media[selectedCategory] || [];

  // Si no hay imágenes en la categoría seleccionada, no renderizar nada
  if (!images || images.length === 0) {
    if (showModal) {
      return (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
        >
          <div className="relative w-full max-w-6xl mx-auto bg-white rounded-lg border border-gray-300 shadow p-2 sm:p-4 md:p-6 lg:p-10 flex flex-col items-center">
            <button
              onClick={onClose}
              className="absolute -top-1 right-0 p-2 sm:p-3 md:p-4 lg:p-5 text-gray-900 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-7 lg:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-gray-500 py-20">No hay imágenes en esta categoría.</div>
            {/* Botones de categoría */}
            <div className="w-full flex justify-center mt-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300'} transition-all`}
                >
                  {media[cat][0]?.label || cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentSlide(initialSlide);
  }, [initialSlide, selectedCategory]);

  const scrollThumbnailIntoView = useCallback((index: number) => {
    const thumbnail = thumbnailRefs.current[index];
    const container = thumbnailContainerRef.current;
    if (thumbnail && container) {
      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = thumbnail.getBoundingClientRect();
      const scrollLeft = thumbnail.offsetLeft - (containerRect.width / 2) + (thumbnailRect.width / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
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
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentSlide(index);
    scrollThumbnailIntoView(index);
  };

  // --- Nuevo: Botones de categoría ---
  const categoryButtons = (
    <div className="w-full flex justify-center mt-4 gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300'} transition-all`}
        >
          {media[cat][0]?.label || cat}
        </button>
      ))}
    </div>
  );

  const carouselContent = (
    <div 
      className="relative w-full max-w-6xl mx-auto bg-white rounded-lg border border-gray-300 shadow p-2 sm:p-4 md:p-6 lg:p-10 flex flex-col items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={onClose}
        className="absolute -top-1 right-0 p-2 sm:p-3 md:p-4 lg:p-5 text-gray-900 hover:text-blue-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-7 lg:w-7"
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
      {/* Main Content Area with Navigation */}
      <div className="relative w-full max-w-[1200px] flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Navigation Button */}
        <button
          onClick={prevSlide}
          className="bg-white border border-gray-300 text-blue-600 p-1 sm:p-1.5 md:p-2 lg:p-3 rounded-full shadow-sm hover:bg-blue-50 transition-all z-10 flex-shrink-0"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        </button>
        {/* Main Slide Area */}
        <div className="relative w-full aspect-[16/9] rounded-lg border border-gray-300 bg-white overflow-hidden flex items-center justify-center">
          <Image
            src={images[currentSlide].url}
            alt={images[currentSlide].label || `Slide ${currentSlide + 1}`}
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Right Navigation Button */}
        <button
          onClick={nextSlide}
          className="bg-white border border-gray-300 text-blue-600 p-1 sm:p-1.5 md:p-2 lg:p-3 rounded-full shadow-sm hover:bg-blue-50 transition-all z-10 flex-shrink-0"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
        </button>
      </div>
      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="w-full max-w-[1200px] mt-2 sm:mt-4 md:mt-6 mb-1">
          <div 
            ref={thumbnailContainerRef}
            className="flex space-x-2 sm:space-x-4 overflow-x-auto py-1 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {images.map((image, index) => (
              <button
                key={index}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg border border-gray-300 overflow-hidden transition-all bg-white shadow-sm ${
                  currentSlide === index ? 'ring-2 ring-blue-600 border-blue-600 scale-105 z-10' : 'opacity-70 hover:opacity-100'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={image.label || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Botones de categoría en la parte inferior */}
      {categoryButtons}
    </div>
  );

  if (showModal) {
    return (
      <div 
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
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