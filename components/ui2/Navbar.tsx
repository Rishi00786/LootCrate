"use client"

import React from 'react'
import Image from 'next/image'
import { ModeToggle } from '../mode-toggle'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from '../ui/button'
import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react';
import { X } from 'lucide-react';
import { useStateContext } from '@/context/index';
import Sidebar from '@/components/ui2/Sidebar'


const Navbar = () => {

    const { sidebar, setSidebar } = useStateContext()

    const handleSidebar = () => {
        setSidebar(!sidebar)
    }

    return (
        <>
            <div className='w-[100vw] h-[8vh] flex items-center justify-around'>
                <div className='flex items-center justify-center gap-2'>
                    <div className='icon'>
                        <Image
                            src="/favicon.ico"
                            width={40}
                            height={40}
                            alt="Picture of the author"
                        />
                    </div>
                    <div className='text-3xl font-bold'>
                        LootCrate
                    </div>
                </div>
                <div className='items-center justify-center gap-8 hidden md:flex'>
                    <NavigationMenu>
                        <NavigationMenuList className="flex items-center justify-center space-x-6">
                            {/* Features Menu */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-white font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                    Features
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className=" rounded-lg shadow-lg p-4">
                                    <div className="gap-2 flex flex-col items-center justify-center">
                                        <NavigationMenuLink className="rounded-md p-2">Apple</NavigationMenuLink>
                                        <NavigationMenuLink className="rounded-md p-2">Banana</NavigationMenuLink>
                                        <NavigationMenuLink className="rounded-md p-2">Orange</NavigationMenuLink>
                                        <NavigationMenuLink className="rounded-md p-2">Grapes</NavigationMenuLink>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div>
                        <Button variant={"secondary"}>Contact</Button>
                    </div>
                </div>
                <div className='items-center justify-center gap-4 hidden md:flex'>
                    <div>
                        <ModeToggle />
                    </div>
                    <div className='flex items-center justify-center transform scale-125'>
                        <UserButton />
                    </div>
                </div>
            <div className='flex gap-4 items-center justify-center md:hidden'>
                {sidebar ? (<div onClick={handleSidebar} className=''>
                    <X />
                </div>) : (
                    <div onClick={handleSidebar} className=''>
                        <Menu />
                    </div>
                )}
                <div className='flex items-center justify-center'>
                    <UserButton/>
                </div>
            </div>
            </div>
            <div>
                {
                    sidebar && (
                        <Sidebar />
                    )
                }
            </div>
        </>
    )
}

export default Navbar
