import React from 'react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

const bannerData = [
  {
    image: "banner.png",
    title: "Discover Our Collection",
    description: "Explore our latest arrivals and trending styles"
  },
  {
    image: "Men1.png",
    title: "Premium Quality",
    description: "Crafted with excellence and attention to detail"
  },
  {
    image: "Men2.png",
    title: "Exclusive Designs",
    description: "Unique pieces for unique personalities"
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = oldProgress + (100 / 70); // 70 steps for 7 seconds
        return newProgress >= 100 ? 0 : newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentSlide]);

  useEffect(() => {
    if (progress >= 100) {
      setCurrentSlide((prev) => (prev + 1) % bannerData.length);
      setProgress(0);
    }
  }, [progress]);

  return (
    <section className="relative h-screen">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 7000,
          }),
        ]}
        className="w-full h-full"
        onSlideChange={(index) => {
          setCurrentSlide(index);
          setProgress(0);
        }}
      >
        <CarouselContent>
          {bannerData.map((banner, index) => (
            <CarouselItem key={index} className="h-screen">
              <motion.div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${banner.image}')`,
                  willChange: 'transform'
                }}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 1.2,
                  ease: [0.43, 0.13, 0.23, 0.96],
                  delay: 0.2
                }}
              />
              <div className="absolute inset-0 bg-black/50" />
              
              {/* Floating Description */}
              <motion.div 
                className="absolute bottom-20 right-10 max-w-md p-6 glass-effect rounded-lg"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-white mb-2">
                  {banner.title}
                </h2>
                <p className="text-white/90 mb-4">
                  {banner.description}
                </p>
                <Progress 
                  value={index === currentSlide ? progress : 0} 
                  className="h-1 bg-white/20"
                />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default Hero;