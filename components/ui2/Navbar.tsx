// Navbar.tsx
"use client";

import React from 'react';
import { ModeToggle } from '../mode-toggle';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from '../ui/button';
import { UserButton } from '@clerk/nextjs';
import { Menu } from 'lucide-react';
import { X } from 'lucide-react';
import { useStateContext } from '@/context/index';
import Sidebar from '@/components/ui2/Sidebar';
import { FaBeer } from "react-icons/fa";
import Link from 'next/link';

const Navbar = () => {

    const { sidebar, setSidebar } = useStateContext();

    const handleSidebar = () => {
        setSidebar(!sidebar);
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            <div className='w-[100vw] h-[8vh] flex items-center justify-around'>
                <div className='flex items-center justify-center gap-2'>
                    <div className='icon'>
                        <FaBeer className='h-16 w-6'/>
                    </div>
                    <div className='text-2xl heading-font sm:text-3xl font-bold'>
                        LootCrate
                    </div>
                </div>
                <div className='items-center justify-center gap-8 hidden md:flex'>
                    <NavigationMenu>
                        <NavigationMenuList className="flex items-center justify-center space-x-6">
                            {/* Features Menu */}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-black sub-sub-heading-font font-medium bg-gray-300  hover:bg-gray-400">
                                    Features
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className=" rounded-lg shadow-lg p-4">
                                    <div className="gap-2 flex flex-col items-center justify-center">
                                        <Link href='/songs'><NavigationMenuLink className="sub-sub-heading-font rounded-md p-2">Songs</NavigationMenuLink></Link>
                                        <Link href='/movies'><NavigationMenuLink className="sub-sub-heading-font rounded-md p-2">Movies</NavigationMenuLink></Link>
                                        <Link href='/webseries'><NavigationMenuLink className="sub-sub-heading-font rounded-md p-2">WebSeries</NavigationMenuLink></Link>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div>
                        <Button className='bg-gray-300 hover:bg-gray-400 text-black sub-sub-heading-font' onClick={() => scrollToSection('contact')}>Contact</Button>
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
                {sidebar && <Sidebar />}
            </div>
        </>
    );
};

export default Navbar;