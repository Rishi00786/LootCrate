import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const Features = () => {
  return (
    <div className='max-w-[100vw] h-[50vh] flex flex-col items-start justify-start gap-20 ml-[20vh]'>
      <div>
        <h1 className='text-5xl font-bold text-white'>Features</h1>
      </div>
      <div className='flex items-center justify-start gap-12 flex-wrap'>
        <div>
            <Link href="/songs"><Button className='h-14 font-semibold'>Download Songs</Button></Link>
        </div>
        <div>
            <Button className='h-14 font-semibold'>Download Books</Button>
        </div>
        <div>
            <Button className='h-14 font-semibold'>Download Movies</Button>
        </div>
        <div>
            <Button className='h-14 font-semibold'>Download Movies</Button>
        </div>
        <div>
            <Button className='h-14 font-semibold'>Download Movies</Button>
        </div>
        <div>
            <Button className='h-14 font-semibold'>Download Movies</Button>
        </div>
        <div>
            <Button className='h-14 font-semibold'>Download Movies</Button>
        </div>
        <div>
            <Button className='h-14 font-semibold'>Download Movies</Button>
        </div>
      </div>
    </div>
  )
}

export default Features
