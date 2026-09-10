
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function DashboardLayout({ children }) {
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
      {children}
      <Footer />
    </div>
  )
}

export default DashboardLayout
