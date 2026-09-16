import { PricingTable } from "@clerk/nextjs"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"


function Pricing() {
  return (
   <div
      className="h-screen overflow-y-scroll bg-gray-50 text-slate-900 flex flex-col font-sans"
      style={{
        backgroundImage: "url('/layout_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Navbar />
<div className="max-w-4xl mx-auto w-full min-h-[cal(100vh-7rem)]  flex flex-col gap-5 items justify-center p-8">
  <div className="mb-8">
    <h1 className="text-3xl font-medium tracking-tight text-slate-900">Upgrade your plan</h1>
<p className="text-sm text-slate-500 mt-1">Choose the plan that's right for you and unlock all the features of MeetUp</p>
  </div>
 <PricingTable />
</div>
 
      <Footer />
    </div>
  )
}

export default Pricing