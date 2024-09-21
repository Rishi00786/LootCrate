import Image from 'next/image'
import React from 'react'
import anime from '@/app/public/image.jpeg'
import { Button } from '../ui/button'
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";


const Contact = () => {
    return (
        <div className='w-[100vw] h-[50vh]  flex items-center justify-center gap-20'>
            <div className='relative w-[30vw] h-[40vh]'>
                <Image
                    src={anime}
                    alt="Neon LootCrate"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                />
            </div>
            <div className='w-[28vw] h-[45vh] flex items-center justify-center shadow-2xl rounded-lg'>
                <div className='w-[25vw] h-[40vh]  flex flex-col gap-4 items-center justify-center shadow-2xl rounded-lg'>
                    <div className='text-4xl font-bold'>
                        Your Name
                    </div>
                    <div className='text-center'>
                        Hi, I&apos;m [Your Name], and I&apos;m a passionate developer dedicated to creating innovative solutions through code. I have my <a href="https://rishi-dhingra-portfolio.vercel.app/" target='_blank'>personal website</a> which shows my experiences and skills.
                    </div>
                    <div className='flex flex-wrap items-center justify-center gap-4'>
                        <a href=""><FaInstagram className='text-2xl' /></a>
                        <a href=""><FaLinkedin className='text-2xl' /></a>
                    </div>
                    <div>
                        <a href="https://github.com/Rishi00786" target='_blank'><Button className='h-12 w-24'>Github</Button></a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
