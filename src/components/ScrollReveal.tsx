import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds for staggered animations
  threshold?: number; // Visibility ratio to trigger (0 - 1)
  rootMargin?: string; // IntersectionObserver rootMargin
  as?: React.ElementType; // HTML tag to render, defaults to 'div'
  id?: string;
  distance?: 'sm' | 'md' | 'lg'; // slide up distance
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.08,
  rootMargin = '0px 0px -40px 0px',
  as: Component = 'div',
  id,
  distance = 'md'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Honor reduced motion preferences
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const currentElem = domRef.current;
    if (!currentElem) return;

    // If the element is already above or within the viewport at load time, show immediately
    const rect = currentElem.getBoundingClientRect();
    if (rect.top < (window.innerHeight || document.documentElement.clientHeight)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentElem);

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  const translateClasses = {
    sm: isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
    md: isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
    lg: isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
  }[distance];

  return (
    <Component
      ref={domRef}
      id={id}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-all duration-700 ease-out transform will-change-transform ${translateClasses} ${className}`}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
