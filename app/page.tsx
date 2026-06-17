'use client'
import SmoothScrolling from '@/components/scroll/smooth-scrolling'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
  const route = useRouter()
  useEffect(() => {
    setTimeout(() => {
      route.push("/onboarding")
    }, 0);
  },[])
  return (
    <div className=''>
     <SmoothScrolling/>
    </div>
  )
}

export default page