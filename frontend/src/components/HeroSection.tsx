import { useState } from 'react';
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

const images = [
  {
    id: 1,
    url: "https://images.pexels.com/photos/705255/pexels-photo-705255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    caption: "Luxury Salon Interior"
  },
  {
    id: 2,
    url: "https://images.pexels.com/photos/3992860/pexels-photo-3992860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    caption: "Premium Hairstyling"
  },
  {
    id: 3,
    url: "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    caption: "Relaxing Spa Experience"
  }
];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const prevSlide = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden">
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10 bg-purple-600 text-white px-4 py-1 rounded-full">
        Unisex
      </div>
      
      {/* Image Slider */}
      <div className="relative h-full ">
        {images.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out rounded-xl overflow-hidden ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.url} 
              alt={slide.caption}
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white z-10 transition-all"
      >
        <FaChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white z-10 transition-all"
      >
        <FaChevronRight className="h-6 w-6" />
      </button>
      
      {/* Rating */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center bg-black/70 text-white px-3 py-2 rounded-lg">
        <div className="mr-2 font-bold">4.25</div>
        <FaRegStar className="h-5 w-5 text-amber-400 fill-amber-400" />
      </div>
      
      {/* Photo count */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/70 text-white px-3 py-2 rounded-lg flex flex-col items-center text-sm">
        <div className="font-medium">45</div>
        <div className="text-xs">Photos</div>
      </div>
    </div>
  );
};

export default HeroSection;