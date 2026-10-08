"use client";

import { useState, useRef } from "react";
import { Play, Pause, Sparkles } from "lucide-react";

// Replace this with your actual ImageKit video URL
const VIDEO_URL = "https://ik.imagekit.io/benjiblog/meetly%20original.mp4";

export default function AiNotesShowcase() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      video.pause();
    } else {
      video.play().catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Unable to play AI notes video:", error);
        }
      });
    }
  };

  return (
    <section className="w-full py-16 sm:py-20 lg:py-18 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            Meetly assistance
          </span>
        </div>

        {/* Heading row: title + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 max-w-xl leading-tight">
            Your new meeting assistant 
          </h2>
          <a
            href="/features/ai-notes"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Explore new  features
          </a>
        </div>

        {/* Video card */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-gray-900">
          <video
            ref={videoRef}
            src={VIDEO_URL}
            className="w-full h-auto block"
            autoPlay
            loop
            muted
            playsInline
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {/* Play/pause control */}
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pause video" : "Play video"}
            className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            {playing ? (
              <Pause size={18} className="fill-white" />
            ) : (
              <Play size={18} className="fill-white ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}