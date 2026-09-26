import Link from "next/link"
import { ArrowRight } from "lucide-react"

const OPTIONS = [
  {
    tag: "START NOW",
    title: "Instant meetings",
    description:
      "Create a room in one click and share the link. No scheduling, no sign-in required for guests.",
    image: "/section.jpg",
    href: "/sign-up",
    linkLabel: "Start an instant meeting",
  },
  {
    tag: "PLAN AHEAD",
    title: "Scheduled meetings",
    description:
      "Pick a time, invite your team by email or calendar link, and get automatic reminders before the call.",
    image: "/section1.jpg",
    href: "/sign-up",
    linkLabel: "Schedule a meeting",
  },
]

export default function MeetingModes() {
  return (
    <section className="w-full py-15 md:py-15 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
            How do you want to meet?
          </h2>
          <p className="text-base md:text-lg text-slate-600">
            Two ways to connect on Meetly: jump into a call right now, or set
            one up for later — whichever fits the moment.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {OPTIONS.map((option) => (
            <div key={option.title} className="flex flex-col">
              <div
                className="w-full aspect-[4/3] rounded-xl bg-cover bg-center bg-slate-200"
                style={{ backgroundImage: `url(${option.image})` }}
              />

              <span className="mt-6 text-xs md:text-sm font-semibold tracking-wide text-orange-600">
                {option.tag}
              </span>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {option.title}
              </h3>

              <p className="mt-3 text-slate-600 leading-relaxed">
                {option.description}
              </p>

              <Link
                href={option.href}
                className="mt-5 inline-flex items-center gap-1.5 text-orange-600 font-semibold hover:gap-2.5 transition-all"
              >
                {option.linkLabel}
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}