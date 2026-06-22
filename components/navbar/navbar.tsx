'use client'
import { Menu, UtensilsCrossed, Moon, Sun, User, LogOut, Settings, ChevronDown } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"
import { useTheme } from "next-themes"
import { LOGOS } from "@/public/logo/logo"
import { useAuth } from "@/hooks/use-auth"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const { user, isAuthenticated, isLoading, signOut } = useAuth()
    const router = useRouter()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Extract user data from nested structure
    //@ts-ignore
    const userData = user?.user || user
    const userName = userData?.name || userData?.displayName || ""
    const userEmail = userData?.email || user?.email || ""

    // Debug log to see what user data is available
    useEffect(() => {
        if (user) {
            console.log("Full user object:", user)
            console.log("Extracted userData:", userData)
            console.log("User name:", userName)
            console.log("userid", userData.id)
            console.log("User email:", userEmail)
        }
    }, [user, userData, userName, userEmail])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = async () => {
        try {
            await signOut()
            router.push("/partner-with-us/new")
            setDropdownOpen(false)
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    const getDisplayName = () => {
        if (!user) return "User"
        // Try multiple possible locations for the name
        return userName || "User"
    }

    const getInitials = () => {
        if (!user) return "U"
        const name = userName || "User"
        return name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    // Show loading state
    if (isLoading) {
        return (
            <nav className="bg-transparent">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <Image
                                src={theme === "dark" ? LOGOS.DARK : LOGOS.LIGHT}
                                alt="FoodExpress Logo"
                                className="h-24 w-24 object-contain"
                                width={96}
                                height={96}
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button variant="outline" size="icon" className="border-border">
                                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                            <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className="bg-transparent">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Image
                            src={theme === "dark" ? LOGOS.DARK : LOGOS.LIGHT}
                            alt="FoodExpress Logo"
                            className="h-24 w-24 object-contain"
                            width={96}
                            height={96}
                        />
                    </div>

                    {/* Right side buttons */}
                    <div className="flex items-center space-x-3">
                        {/* Theme Toggle Button */}
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="border-border"
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </Button>

                        {/* User Avatar / Login Button */}
                        {isAuthenticated && user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 rounded-full transition-all focus:outline-none"
                                >
                                    <Avatar className="h-9 w-9 border-2 border-none">
                                        <AvatarImage src={userData?.photoURL || userData?.photoUrl || ""} />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                                            {getInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                   
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-1">
                                            {/* User Info */}
                                            <div className="px-4 py-3 border-b border-border">
                                                <p className="text-sm font-medium text-foreground">
                                                    {getDisplayName()}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {userEmail || userData?.email || "No email"}
                                                </p>
                                            </div>

                                            {/* Profile */}
                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false)
                                                    router.push("/profile")
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                                            >
                                                <User className="h-4 w-4" />
                                                Profile
                                            </button>

                                            {/* Settings */}
                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false)
                                                    router.push("/settings")
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                                            >
                                                <Settings className="h-4 w-4" />
                                                Settings
                                            </button>

                                            {/* Logout */}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-secondary transition-colors border-t border-border"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                           <></>
                        )}

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