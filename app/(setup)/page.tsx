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
      "h-full"
    )}>
      <Navbar/>
      <Hero/>
      <Features/>
      <Contact/> 
    </div>
  );
}
