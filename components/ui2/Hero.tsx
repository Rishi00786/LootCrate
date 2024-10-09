// Hero.tsx
"use client";

import React from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import anime from '@/app/public/bleach.jpeg';
import { cn } from '@/lib/utils';

const Hero = () => {

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className='w-[100vw] h-full flex sm:flex-row flex-col gap-12 items-center justify-center'>
            <div className='flex flex-col items-center sm:items-start justify-center gap-6 w-full sm:w-[40vw] p-10 rounded-lg'>
                <div className={cn(
                    'text-3xl text-center sub-heading-font sm:text-start sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold',
                    'text-black dark:text-gray-100'  // Light mode text is white, dark mode text is light gray
                )}>
                    House of Endless Content
                </div>

                <div className={cn(
                    'sm:text-sm sub-sub-heading-font md:text-lg sm:text-start font-light leading-relaxed text-center',
                    'text-black dark:text-gray-200'  // Light mode text is white, dark mode text is lighter gray
                )}>
                    Instantly grab your favorite media—music, movies, and web series all in one place.
                </div>
                <div>
                    <Button
                        className={cn("px-6 sub-sub-heading-font py-6 mt-8 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-md")}
                        onClick={() => scrollToSection('features')}
                    >
                        Try It Now
                    </Button>
                </div>
            </div>

            <div className='relative hidden sm:flex self-center w-[80vw] h-[40vh] sm:w-[40vw] sm:h-[50vh] lg:w-[40vw] lg:h-[70vh] rounded-lg shadow-lg overflow-hidden'>
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
    );
};

export default Hero;
