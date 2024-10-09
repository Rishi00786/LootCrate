import Navbar from '@/components/ui2/Navbar'
import { cn } from '@/lib/utils'
import React from 'react'

const MoviesLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className={cn("w-[100vw] min-h-screen")}>
        <Navbar />
        {children}
    </div>
  )
}

export default MoviesLayout