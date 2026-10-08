import Menu from "./components/Menu";
import HeroCarousel from "./components/Herocarousel";
import MeetingModes from "./components/Modes";
import TeamMemberSection from "./components/TeamMemberSection";
import Testimonials from "./components/Testimonials";
import { FAQ } from "./components/Faq";
import Bottom from "./components/Buttom";
import AiNotesShowcase from "./components/Ainotesshowcase";


export default function Home() {
  return (
   <div >
    <Menu />
    <HeroCarousel />
    <MeetingModes />
    <AiNotesShowcase />
    <TeamMemberSection />
    <Testimonials />
    <FAQ />
    <Bottom />
    </div>
  );
}
