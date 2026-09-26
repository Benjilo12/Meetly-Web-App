"use client";

import React from 'react';

function Testimonials() {
  const testimonials = [
    {
      name: "Jonathan Yombo",
      title: "Software Engineer",
      text: "Meetly's live captions have saved so many calls where the connection was shaky. Nobody ever asks 'can you repeat that' anymore.",
      image: "https://i.postimg.cc/W1rCvYnT/nazmul-hossain.jpg",
    },
    {
      name: "Yves Kakume",
      title: "Product Designer",
      text: "I switched our whole design team to Meetly after one demo. Scheduling a call now takes ten seconds instead of five emails.",
      image: "https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg",
    },
    {
      name: "Yucel Faruksahan",
      title: "Founder, Northline",
      text: "The AI meeting summary is the feature I didn't know I needed. I stopped taking notes during calls entirely.",
      image: "https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg",
    },
    {
      name: "Anonymous author",
      title: "Small business owner",
      text: "I'm not very technical and I was worried about setting up video calls for client meetings. Meetly turned out to be the simplest tool I tried. One link, no downloads, and my clients just click and join. It's genuinely made me look more professional without any extra effort on my part.",
      image: "https://i.pinimg.com/1200x/c2/4e/27/c24e271f2f992fd7e62e8c1e8d9b3e2f.jpg",
    },
    {
      name: "Shekinah Tshikulila",
      title: "Software Engineer",
      text: "Meetly is redefining what a simple call room should feel like. Fast to join, clean interface, nothing gets in the way of the conversation.",
      image: "https://i.pinimg.com/736x/81/d6/b1/81d6b158728f5fc97ca6e0a025fefee0.jpg",
    },
    {
      name: "Khatab Wedaa",
      title: "Startup Founder",
      text: "Clean, fast, and reliable. Exactly what a video call tool should be, nothing more, nothing less.",
      image: "https://i.pinimg.com/736x/9f/46/74/9f4674ca9c17330ab419c1b2f5951d9a.jpg",
    },
    {
      name: "Oketa Fred",
      title: "Fullstack Developer",
      text: "I absolutely love Meetly. The call room loads instantly and the mute/camera controls just work, no lag, no weird bugs.",
      image: "https://i.pinimg.com/736x/57/3c/80/573c80967c9429d0ed0ce32701f85b70.jpg",
    },
    {
      name: "Rodrigo Aguilar",
      title: "Remote Team Lead",
      text: "Our team is spread across three time zones. Meetly's scheduling link made syncing everyone up finally painless.",
      image: "https://i.pinimg.com/736x/b0/c4/21/b0c421e77cf563962026ade82c90dd5b.jpg",
    },
    {
      name: "Zeki",
      title: "Founder of ChatExtend",
      text: "Using Meetly has been like unlocking a secret productivity superpower. Instant meetings, live captions, and summaries in one calm room.",
      image: "https://i.pinimg.com/736x/ce/31/42/ce3142d7a968fff3aecd0100572a5e8b.jpg",
    },
    {
      name: "Eric Ampire",
      title: "Mobile Engineer",
      text: "Meetly is the perfect solution for anyone who wants reliable video calls without the bloat. Easy to use, customizable, and the support team is genuinely responsive. Highly recommend it to any small team.",
      image: "https://i.pinimg.com/736x/79/63/a5/7963a5246188d408b8f28961a0cf2b90.jpg",
    },
    {
      name: "Joseph Kitheka",
      title: "Fullstack Developer",
      text: "Meetly has transformed the way our team runs standups and client calls. The AI summary alone has saved us hours every week.",
      image: "https://i.pinimg.com/736x/8e/c1/f8/8ec1f80db272047cedf4c20263114387.jpg",
    },
    {
      name: "Roland Tubonge",
      title: "Software Engineer",
      text: "Meetly is so well designed that even our least technical team members had no trouble joining their first call. Let yourself be seduced!",
      image: "https://i.pinimg.com/1200x/08/a2/41/08a2413b771b729a9f9df20fa97be52a.jpg",
    },
    {
      name: "Jane Doe",
      title: "UX Designer",
      text: "The interface is intuitive and the live captions have genuinely improved accessibility for our whole design review process.",
      image: "https://i.pinimg.com/736x/b0/7b/cc/b07bcc19e5d06dfb888c3263724b8baa.jpg",
    },
  ];

  const anonymousFallbackImage = "https://placehold.co/48x48/6B7280/FFFFFF?text=AA";

  return (
    <div className="font-sans flex flex-col items-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 bg-orange-300">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center max-w-4xl leading-tight mb-4 text-blue-600">
        Loved by teams who meet a lot
      </h2>

      <p className="text-base sm:text-lg text-gray-200 text-center max-w-3xl mb-16">
        From solo freelancers to full engineering teams, here's what people are saying about calling with Meetly.
      </p>

      <div className="w-full max-w-7xl columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md break-inside-avoid border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
                onError={(e) => {
                  const target = e.target;
                  target.onerror = null;
                  target.src = anonymousFallbackImage;
                }}
              />
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.title}</p>
              </div>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              {testimonial.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;