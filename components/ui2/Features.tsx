import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const Features = () => {
  return (
    <div id="features" className='w-full sm:h-[50vh] h-[70vh] flex flex-col items-center justify-center gap-10 px-6 sm:px-12 md:px-24 lg:px-40'>
      <h1 className={cn('text-4xl sub-heading-font sm:text-5xl font-bold text-center text-black dark:text-white', )}>
        Features
      </h1>

      <div className='flex flex-wrap justify-center gap-8'>
        <div className='w-full sm:w-auto'>
          <Link href="/songs">
            <Button className='h-14 sub-sub-heading-font w-full sm:w-auto font-semibold'>Download Songs</Button>
          </Link>
        </div>
        <div className='w-full sm:w-auto'>
          <Link href="/webseries">
            <Button className='h-14 sub-sub-heading-font w-full sm:w-auto font-semibold'>Download Web Series</Button>
          </Link>
        </div>
        <div className='w-full sm:w-auto'>
          <Link href="/movies">
            <Button className='h-14 sub-sub-heading-font w-full sm:w-auto font-semibold'>Download Movies</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Features