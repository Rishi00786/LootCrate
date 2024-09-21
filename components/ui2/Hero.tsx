"use client"
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
// import neon from '@/app/public/neon.png'
import anime from '@/app/public/image.jpeg'

const Hero = () => {

    useEffect(() => {

    }, [])

    return (
        <div className='w-[100vw] h-[92vh] flex gap-12 items-center justify-center'>
            <div className='flex flex-col items-start justify-center gap-6 w-[40vw] p-10  rounded-lg'>
                <div className='text-5xl font-bold text-white'>
                    LootCrate
                </div>
                <div className='text-lg font-light text-white leading-relaxed'>
                    A simple and user-friendly loot crate app for getting whatever you want in no time.
                </div>
                <div>
                    <Button className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-200 rounded-md">
                        Try It Now
                    </Button>
                </div>
            </div>

            {/* Slideshow section */}
            <div className='relative w-[40vw] h-[70vh] rounded-lg shadow-lg overflow-hidden'>
                <div className='absolute inset-0'>
                    <Image
                        src={anime}
                        alt="Neon LootCrate"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
            </div>
        </div>
    )
}

export default Hero