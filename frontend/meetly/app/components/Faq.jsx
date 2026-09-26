"use client";

import React, { useState, forwardRef } from "react";

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
  </svg>
);

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 14v.01M12 12a2 2 0 10-2-2m2 6h0a2 2 0 100-4m0 0V9m0 0a9 9 0 11-6.219 2.781" />
  </svg>
);

const defaultFaqs = [
  {
    question: "Do I need to download anything to join a Meetly call?",
    answer:
      "No. Meetly runs entirely in your browser. Just open the meeting link and join, no app or plugin required.",
  },
  {
    question: "How many people can join one Meetly meeting?",
    answer:
      "Free meetings support up to 40 minutes and 25 participants. Paid plans raise both the time limit and the participant cap.",
  },
  {
    question: "Does Meetly offer live captions?",
    answer:
      "Yes, live captions can be turned on in any call from the meeting controls, and they're generated in real time as people speak.",
  },
  {
    question: "Can I schedule a Meetly meeting in advance?",
    answer:
      "Yes. Create a scheduled meeting, share the link with your team, and everyone gets a reminder before the call starts.",
  },
  {
    question: "Does Meetly generate a summary after the call?",
    answer:
      "When enabled, Meetly turns the meeting transcript into a short summary along with a list of action items once the call ends.",
  },
  {
    question: "Is my data private on Meetly?",
    answer:
      "Meeting content is encrypted in transit, and transcripts or recordings are only stored if you choose to enable that feature.",
  },
];

const FAQ = forwardRef(
  (
    {
      faqs = defaultFaqs,
      title = "Frequently asked questions about Meetly",
      searchable = false,
      colorScheme = "blue",
      className = "",
      ...props
    },
    ref
  ) => {
    const [openItems, setOpenItems] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState("");

    const toggleItem = (index) => {
      const newOpenItems = new Set(openItems);
      if (newOpenItems.has(index)) newOpenItems.delete(index);
      else newOpenItems.add(index);
      setOpenItems(newOpenItems);
    };

    const filteredFaqs = faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const colorSchemes = {
      blue: {
        gradient: "from-blue-600 via-purple-600 to-indigo-600",
        accent: "text-blue-600",
        border: "border-blue-200",
        hover: "hover:border-blue-300",
        bg: "bg-blue-50",
        searchBg: "bg-blue-100",
      },
      purple: {
        gradient: "from-purple-600 via-pink-600 to-rose-600",
        accent: "text-purple-600",
        border: "border-purple-200",
        hover: "hover:border-purple-300",
        bg: "bg-purple-50",
        searchBg: "bg-purple-100",
      },
      green: {
        gradient: "from-green-600 via-teal-600 to-cyan-600",
        accent: "text-green-600",
        border: "border-green-200",
        hover: "hover:border-green-300",
        bg: "bg-green-50",
        searchBg: "bg-green-100",
      },
    };
    const colors = colorSchemes[colorScheme];

    return (
      <div
        ref={ref}
        className={`w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 ${className}`}
        {...props}
      >
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="relative inline-block px-2">
            <h2
              className={`text-2xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r ${colors.gradient} bg-clip-text text-transparent animate-pulse`}
            >
              {title}
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto px-2">
            Find answers to common questions about using Meetly. Tap any question to expand it.
          </p>
        </div>

        {/* Search */}
        {searchable && (
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search Meetly FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-opacity-20 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-105 ${colors.border} ${colors.searchBg}`}
              aria-label="Search FAQs"
            />
          </div>
        )}

        {/* FAQ list */}
        <div className="space-y-3 sm:space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openItems.has(index);
            const displayIndex = faq.index ?? index + 1;
            return (
              <div
                key={index}
                className={`group border-2 rounded-2xl overflow-hidden transition-all duration-500 transform hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-xl backdrop-blur-sm ${colors.border} ${colors.hover} ${colors.bg}`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-4 py-4 sm:px-6 sm:py-5 text-left focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                      <div
                        className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm transition-transform duration-300 bg-linear-to-r ${colors.gradient} ${isOpen ? "rotate-12" : ""}`}
                      >
                        {displayIndex}
                      </div>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`shrink-0 flex items-center space-x-2 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                    >
                      {isOpen ? <MinusIcon /> : <PlusIcon />}
                    </div>
                  </div>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                    <div className="pl-10 sm:pl-12">
                      <div className="w-full h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-3 sm:mb-4"></div>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg animate-fadeIn">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredFaqs.length === 0 && searchTerm && (
          <div className="text-center py-10 sm:py-12 px-4">
            <HelpIcon />
            <p className="text-gray-600 text-base sm:text-lg">
              No Meetly FAQs found matching your search.
            </p>
          </div>
        )}
      </div>
    );
  }
);

FAQ.displayName = "FAQ";

export { FAQ };