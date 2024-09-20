"use client"
import React, { useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import neon from '@/app/public/neon.png'
import anime from '@/app/public/image.jpeg'
import { gsap } from 'gsap'

const Hero = () => {
    const imgMain1 = useRef(null)
    const imgMain2 = useRef(null)
    // const [currentImage, setCurrentImage] = useState(0)

    useEffect(() => {
        const images = [imgMain1.current, imgMain2.current]
        const tl = gsap.timeline({ repeat: -1, yoyo: true })
        
        images.forEach((img) => {
            tl.to(img, { autoAlpha: 1, scale: 1.1 })
              .to(img, { autoAlpha: 0, scale: 1 })
        })

    }, [])

    return (
        <div className='w-[100vw] h-[85vh] flex gap-12 items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700'>
            <div className='flex flex-col items-start justify-center gap-6 w-[40vw] p-10 bg-yellow-500 rounded-lg shadow-lg'>
                <div className='text-5xl font-bold text-white'>
                    LootCrate
                </div>
                <div className='text-lg font-light text-white leading-relaxed'>
                    A simple and user-friendly loot crate app for getting whatever you want in no time.
                </div>
                <div>
                    <Button className="px-6 py-3 bg-white text-gray-900 hover:bg-gray-200 rounded-md shadow-md">
                        Try It Now
                    </Button>
                </div>
            </div>

            {/* Slideshow section */}
            <div className='relative w-[40vw] h-[70vh] bg-yellow-500 rounded-lg shadow-lg overflow-hidden'>
                <div className='absolute inset-0'>
                    <Image
                        ref={imgMain1}
                        src={neon}
                        alt="Neon LootCrate"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg opacity-0" // Initially hidden
                    />
                </div>
                <div className='absolute inset-0'>
                    <Image
                        ref={imgMain2}
                        src={anime}
                        alt="Anime LootCrate"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg opacity-0" // Initially hidden
                    />
                </div>
            </div>
        </div>
    )
}

export default Hero