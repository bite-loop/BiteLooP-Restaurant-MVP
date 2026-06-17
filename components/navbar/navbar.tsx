'use client'
import { Menu, UtensilsCrossed, Moon, Sun } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"
import { useTheme } from "next-themes"
import { LOGOS } from "@/public/logo/logo"

export const Navbar = () => {
    const {theme, setTheme} = useTheme()
    
  return (
    <nav className="bg-transparent ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src={theme === "dark" ? LOGOS.DARK : LOGOS.LIGHT}
              alt="FoodExpress Logo"
              className="h-24 w-24 object-contain"
            />
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className=""
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}