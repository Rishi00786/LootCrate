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

const Sidebar = () => {
  return (
    <div className='min-h-[65vh] w-[100vw] bg-lime-400 flex flex-col items-center justify-start gap-8'>
      <div className='flex items-center justify-center gap-4 flex-wrap m-[3vh]'>
        <div>
          <Button size={"lg"} variant={"secondary"}>Contact</Button>
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
              <NavigationMenuTrigger className="text-white font-medium h-14 w-28">
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
      </div>
    </div>
  )
}

export default Sidebar