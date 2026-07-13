"use client"
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import React from 'react'

const PartnerMenu = () => {
    const {signOut} = useAuth()
    const router = useRouter()
     const handleLogout = async () => {
        try {
            await signOut()
            router.push("/partner-with-us/new")
           
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }
  return (
    <Button
     onClick={handleLogout}
    >
        Logout
    </Button>
  )
}

export default PartnerMenu