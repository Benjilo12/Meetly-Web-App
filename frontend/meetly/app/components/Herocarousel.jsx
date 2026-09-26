'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


// Edit this array with your own slides/images/copy
const SLIDES = [
  {
    tabLabel: 'HD VIDEO',
    eyebrow: 'CRYSTAL CLEAR CALLS',
    title: 'Meet without the meeting fatigue.',
    subtitle:
      'Sharp video, one-tap scheduling and live captions in a single calm call room.',
    image: '/meetly1.jpg',
  },
  {
    tabLabel: 'LIVE CAPTIONS',
    eyebrow: 'NEVER MISS A WORD',
    title: 'Every word, captioned in real time.',
    subtitle:
      'Live captions keep everyone on the same page, even on a shaky connection.',
    image: '/meetly2.jpg',
  },
  {
    tabLabel: 'AI SUMMARIES',
    eyebrow: 'AFTER THE CALL ENDS',
    title: 'Your meeting notes, written for you.',
    subtitle:
      'Meetly turns every transcript into a summary and a list of action items.',
    image: '/meetly3.jpg',
  },
];

const SLIDE_DURATION = 6000; // ms each slide stays up before auto-advancing

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index) => {
    setCurrent(index);
  }, []);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [current]);

  const slide = SLIDES[current];

  return (
    <section className="relative w-full min-h-svh overflow-hidden bg-slate-950 text-white">
      {/* Background image(s) - crossfade between slides */}
      {SLIDES.map((s, i) => (
        <div
          key={s.tabLabel}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            sizes="100vw"
            quality={80}
            priority={i === 0}
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />

      {/* Slide content */}
      <div className="relative max-w-7xl mx-auto min-h-svh px-4 md:px-8 flex items-center pt-20 pb-24">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-orange-400" />
            <span className="text-xs md:text-sm font-semibold tracking-wider text-orange-400">
              {slide.eyebrow}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {slide.title}
          </h1>

          <p className="text-base md:text-lg text-gray-200 mb-8 max-w-md">
            {slide.subtitle}
          </p>

          <div className="flex items-center gap-6 flex-wrap">
            <Link  href="/sign-in" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Start a meeting
            </Link>
            <button className="flex items-center gap-2 text-white/90 hover:text-white font-medium underline underline-offset-4">
              See how it works
            </button>
          </div>
        </div>
      </div>

      {/* Bottom tab bar with progress indicator, story-bar style */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex flex-1 overflow-x-auto no-scrollbar">
            {SLIDES.map((s, i) => (
              <button
                key={s.tabLabel}
                onClick={() => goTo(i)}
                className="relative shrink-0 px-5 md:px-8 py-4 text-left"
              >
                <span
                  className={`text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap ${
                    i === current ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {s.tabLabel}
                </span>

                {/* progress underline */}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                  {i === current && (
                    <span
                      key={current} // remounts to restart animation each cycle
                      className="block h-full bg-orange-400 origin-left animate-[fillbar_linear_forwards]"
                      style={{ animationDuration: `${SLIDE_DURATION}ms` }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

         
        </div>
      </div>

      {/* Keyframes for the progress bar fill animation */}
      <style jsx>{`
        @keyframes fillbar {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
}