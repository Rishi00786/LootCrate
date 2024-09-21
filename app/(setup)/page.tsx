import { InitialProfile } from '@/lib/initial-profile';
import Navbar from '@/components/ui2/Navbar'
import Hero from '@/components/ui2/Hero'
import Features from '@/components/ui2/Features';
import { cn } from '@/lib/utils';
import Contact from '@/components/ui2/Contact';

export default async function HomePage() {

  const profile = await InitialProfile()

  if (!profile) {
    throw new Error("Profile is null");
  } 

  // console.log(profile)

  return (
    <div className={cn(
      "bg-gradient-to-r from-blue-500 to-purple-500 dark:from-black dark:to-gray-800"
    )}>
      <Navbar/>
      <Hero/>
      <Features/>
      <Contact/>
    </div>
  );
}
