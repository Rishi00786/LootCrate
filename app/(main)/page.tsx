import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex gap-2 items-center justify-center">
      <div className="text-3xl font-medium">LootCrate</div>
      <div><Button variant={"destructive"}>Click me</Button></div>
      <ModeToggle/>
    </div>
  );
}
