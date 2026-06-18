'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { UtensilsCrossed, ArrowRight, LogIn, ChefHat, Menu, FastForward, ShoppingBasket, BarChart3 } from 'lucide-react'
import { Navbar } from '@/components/navbar/navbar'
import Image from 'next/image'
import { LOGOS } from '@/public/logo/logo'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"




const Onboarding = () => {
 
  const router = useRouter()
  return (
    <section className='h-screen overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-yellow-500 flex flex-col'>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent_70%)]" />
          <div className="absolute top-[5%] left-[5%] text-7xl md:text-8xl">🍕</div>
          <div className="absolute top-[8%] right-[8%] text-6xl md:text-7xl">🍔</div>
          <div className="absolute bottom-[15%] left-[10%] text-5xl md:text-6xl">🍜</div>
          <div className="absolute bottom-[8%] right-[5%] text-6xl md:text-7xl">🌮</div>
          <div className="absolute top-[40%] left-[15%] text-4xl md:text-5xl">🍰</div>
          <div className="absolute top-[30%] right-[12%] text-5xl md:text-6xl">🥗</div>
        </div>

        {/* Main Content - Centered vertically and horizontally */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="w-full max-w-sm space-y-5 md:space-y-6">
            
            {/* Hero Section */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full">
               <Image
                src={LOGOS.LOGO}
                alt=''
                className=' object-contain'
                />
              </div>
              <h1 className="text-4xl md:text-4xl font-bold text-white tracking-tight">
                BiteLooP Restaurant Partner 
              </h1>
              <p className="text-lg md:text-xl text-yellow-100 font-medium">
               Grow your restaurant business! 📈
              </p>
            </div>

            {/* Card with content */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Start Ordering Now!
                  </h2>
                  <p className="text-sm text-gray-600">
                    Choose from hundreds of restaurants and get your favorite meals delivered in minutes.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 pb-6 px-6">
                {/* Register Button */}
                <Button 
                  size="lg" 
                  onClick={() => router.push("partner-with-us/new")}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-base h-12 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Proceed to Register</span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>

                {/* Login Button */}
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => router.push("/partners/login")}
                  className="w-full border border-red-500 dark:text-red-600 text-red-600  font-semibold  h-12 rounded-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <LogIn className="w-5 h-5" />
                    <span>I already have an account</span>
                  </span>
                </Button>
              </CardFooter>
            </Card>

            {/* Features */}
           <div className="grid grid-cols-3 gap-3">
  <div className="text-center">
    <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
      <UtensilsCrossed size={20} className="text-white" />
    </div>
    <p className="text-white text-xs font-medium">Manage Menu</p>
  </div>
  <div className="text-center">
    <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
      <ShoppingBasket size={20} className="text-white" />
    </div>
    <p className="text-white text-xs font-medium">Track Orders</p>
  </div>
  <div className="text-center">
    <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
      <BarChart3 size={20} className="text-white" />
    </div>
    <p className="text-white text-xs font-medium">Dashboard</p>
  </div>
</div>

            {/* Footer Text */}
            <p className="text-center text-white/70 text-xs">
              By continuing, you agree to our 
              <Link href={"/term-conditions"} className="hover:underline font-bold"> Terms</Link> of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Onboarding