import React from 'react'
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
import Link from 'next/link'
import { useStateContext } from '@/context'

const Sidebar = () => {

  const { setSidebar } = useStateContext()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

  return (
    <div className='min-h-[65vh] absolute z-20 w-[100vw] bg-white dark:bg-black flex flex-col items-center justify-start gap-8'>
      <div className='flex items-center justify-center gap-4 flex-wrap m-[3vh]'>
        <div>
          <Button size={"lg"} 
                onClick={() => {
                  setSidebar(false)
                  scrollToSection('contact')
                }}
          className='dark:bg-gray-800 dark:text-white sub-sub-heading-font text-black bg-gray-200'>Contact</Button>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
      <div>
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-6">
            {/* Features Menu */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="dark:bg-gray-800 sub-sub-heading-font dark:text-white text-black bg-gray-200 font-medium h-14 w-28">
                Features
              </NavigationMenuTrigger>
              <NavigationMenuContent className=" rounded-lg shadow-lg p-4">
                <div className="gap-2 flex flex-col items-center justify-center">
                  <Link href='/songs'><NavigationMenuLink className=" sub-sub-heading-font rounded-md p-2">Songs</NavigationMenuLink></Link>
                  <Link href='/movies'><NavigationMenuLink className=" sub-sub-heading-font rounded-md p-2">Movies</NavigationMenuLink></Link>
                  <Link href='/webseries'><NavigationMenuLink className=" sub-sub-heading-font rounded-md p-2">WebSeries</NavigationMenuLink></Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}

export default Sidebar