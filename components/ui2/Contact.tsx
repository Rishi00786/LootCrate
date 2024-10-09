"use client"
import Image from 'next/image'
import React, { useRef } from 'react'
import anime from '@/app/public/image.jpeg'
import { Button } from '../ui/button'
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import gsap from 'gsap'

const Contact = () => {

    const infobox = useRef(null); // Make sure it's initialized as null

    const hme = () => {
        gsap.to(infobox.current, {
            duration: 0.5,
            y: -70, // Moves box upwards
            backgroundColor: 'rgb(255, 105, 180)', // Changes background to orange
            // ease: 'elastic.inOut(1, 0.3)',
        });
    }

    const hml = () => {
        gsap.to(infobox.current, {
            duration: 0.5,
            y: 0, // Resets the vertical position
            backgroundColor: 'transparent', // Resets background color to transparent
            color: 'white', // Resets text color to white (for dark mode)
            // ease: 'elastic.inOut(1, 0.3)',
        });
    }

    return (
        <>
            <div id="contact" className='w-[100vw] md:h-[50vh] h-[150vh] flex flex-col items-center justify-center gap-4'>
                {/* Heading for Contact Section */}
                <div className='w-full text-center mb-6'>
                    <h2 className='text-5xl sub-heading-font font-bold text-white'>Contact</h2>
                </div>
                <div className='flex md:flex-row flex-col items-center justify-center gap-8 md:gap-20'>
                    <div className='relative m-2 w-[80vw] h-[40vh] md:w-[22rem] md:h-[35vh] lg:w-[28rem] lg:h-[40vh]'>
                        <Image
                            src={anime}
                            alt="Neon LootCrate"
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-lg"
                        />
                    </div>
                    <div className='md:w-[19rem] m-2 sm:w-[50vw] lg:w-[25rem] sm:h-[55vh] h-[65vh] w-[90vw] rounded-xl border-gray-400 md:h-[45vh] flex items-center justify-center'
                        style={{
                            boxShadow: 'inset 5px 5px 5px rgba(0, 0, 0, 0.05), inset -5px -5px 5px rgba(255, 255, 255, 0.5), 5px 5px 5px rgba(0, 0, 0, 0.05), -5px -5px 5px rgba(255, 255, 255, 0.5)'
                        }}
                    >
                        <div onMouseEnter={hme} 
                            onMouseLeave={hml} 
                            ref={infobox} 
                            className='md:w-[17rem] lg:w-[23rem] sm:w-[42vw] w-[85vw] h-[60vh] sm:h-[50vh] rounded-xl md:h-[43vh] shadow-2xl shadow-gray-200 border-white flex flex-col gap-3 items-center justify-center'>
                            <div className='text-4xl heading-font text-black dark:text-white  font-bold'>
                                Rishi Dhingra
                            </div>
                            <div className='text-center sub-sub-heading-font text-black dark:text-white  m-2'>
                                Hi, I&apos;m Rishi, and I&apos;m a passionate developer dedicated to creating innovative solutions through code. I have my <a href="https://rishi-dhingra-portfolio.vercel.app/" className='text-blue-500 underline underline-offset-2' target='_blank'>personal website</a> which shows my experiences and skills.
                            </div>
                            <div className='flex text-black dark:text-white  flex-wrap items-center justify-center gap-4'>
                                <a href=""><FaInstagram className='text-2xl' /></a>
                                <a href=""><FaLinkedin className='text-2xl' /></a>
                            </div>
                            <div>
                                <a href="https://github.com/Rishi00786" target='_blank'><Button className='h-12 w-24'>Github</Button></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact;