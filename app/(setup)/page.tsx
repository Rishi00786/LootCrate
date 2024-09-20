import { InitialProfile } from '@/lib/initial-profile';
import Navbar from '@/components/ui2/Navbar'
import Hero from '@/components/ui2/Hero'

export default async function HomePage() {

  const profile = await InitialProfile()

  if (!profile) {
    throw new Error("Profile is null");
  } 

  // console.log(profile)

  return (
    <div className="">
      <Navbar/>
      <Hero/>
    </div>
  );
}
