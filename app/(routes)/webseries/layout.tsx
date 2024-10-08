import Navbar from '@/components/ui2/Navbar'
import { cn } from '@/lib/utils'
import React from 'react'

const WebSeriesLayout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className={cn("bg-gradient-to-r w-[100vw] min-h-screen from-blue-500 to-purple-500 dark:from-black dark:to-gray-800")}>
        <Navbar />
        {children}
    </div>
  )
}

export default WebSeriesLayout