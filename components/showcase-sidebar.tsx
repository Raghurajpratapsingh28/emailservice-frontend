import Image from "next/image"

export default function ShowcaseSidebar() {
  return (
    <div className="hidden md:flex md:w-1/2 p-8 md:p-16 flex-col justify-between relative bg-[#1b1614] md:min-h-screen overflow-hidden">
      
      {/* Top Tagline */}
      <div className="z-10">
        <p className="text-xs text-white/50 font-light tracking-wide">
          Global customer engagement made simple – online campaign solutions for you.
        </p>
      </div>

      {/* Mid Showcase Header & Circular BG Lines */}
      <div className="my-auto py-12 flex flex-col items-center justify-center relative w-full">
        
        {/* Subtle concentric rings in background */}
        <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-white/[0.04] flex items-center justify-center pointer-events-none z-0">
          <div className="w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] rounded-full border border-white/[0.03] flex items-center justify-center">
            <div className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] rounded-full border border-white/[0.02]" />
          </div>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1] text-center z-10 font-sans max-w-sm">
          Manage <br />
          <span className="font-light text-white/90">your growth</span>
        </h2>
      </div>

      {/* Bottom Smartphone Mockup (Fits beautifully in the lower panel) */}
      <div className="w-[90%] sm:w-[80%] md:w-[110%] lg:w-[100%] h-[320px] sm:h-[380px] md:h-[420px] relative mx-auto md:ml-4 mt-auto z-10 translate-y-8 md:translate-y-16">
        <Image
          src="/hand-phone.png"
          alt="EngageIQ Dashboard Showcase"
          fill
          priority
          className="object-contain object-bottom"
          sizes="(max-width: 768px) 100vw, 45vw"
        />
      </div>

      {/* Small branding badge overlay */}
      <div className="absolute bottom-6 left-6 z-20 md:block hidden">
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-[#1b1614]/80 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-orange-500 to-red-500" />
        </div>
      </div>

    </div>
  )
}
