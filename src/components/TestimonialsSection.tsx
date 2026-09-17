import React, { useState } from 'react';
import { INITIAL_TESTIMONIALS } from '../data/initialData';
import { Star, ChevronLeft, ChevronRight, Quote, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % INITIAL_TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + INITIAL_TESTIMONIALS.length) % INITIAL_TESTIMONIALS.length);
  };

  return (
    <section className="py-14 lg:py-20 bg-[#FAF9F7] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Navigation */}
        <ScrollReveal className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#9A7632] uppercase block mb-1">
              Client Trust & Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A192F]">
              What Our Clients Say
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#reviews"
              onClick={(e) => { e.preventDefault(); alert('Over 2,400 verified 5-star reviews across Trustpilot and Google Reviews.'); }}
              className="hidden sm:flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#0A192F] hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              View All Reviews <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={prevTestimonial}
                aria-label="Previous review"
                className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#0A192F] hover:text-white flex items-center justify-center text-gray-700 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextTestimonial}
                aria-label="Next review"
                className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-[#0A192F] hover:text-white flex items-center justify-center text-gray-700 transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Testimonial Cards matching reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_TESTIMONIALS.map((test, index) => {
            const isHighlight = index === 0;
            return (
              <ScrollReveal
                key={test.id}
                delay={index * 100}
                className="h-full"
              >
                <div
                  className={`p-7 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-full ${
                    isHighlight 
                      ? 'bg-white border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]' 
                      : 'bg-white border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
                  }`}
                >
                  <div>
                    {/* 5 Gold Stars */}
                    <div className="flex items-center gap-1 text-[#C5A059] mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-sm text-gray-700 leading-relaxed italic font-serif">
                      "{test.comment}"
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A192F]">
                        &mdash; {test.name}
                      </h4>
                      {test.role && (
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          {test.role} &bull; {test.location}
                        </span>
                      )}
                    </div>
                    <Quote className="w-6 h-6 text-gray-200" />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center items-center gap-1.5 mt-8">
          {INITIAL_TESTIMONIALS.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === activeIndex ? 'w-5 bg-[#0A192F]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
