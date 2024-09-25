import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

    try {

        const profile = await currentProfile();
  
      if (!profile) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const body = await req.json();
      const { videoURL } = body;

      if (!videoURL) {
        return new NextResponse("Invalid videoURL", { status: 400 });
      }

      const song = await db.songs.create({
        data: {
            songURL: videoURL,
            profileId: profile.id,
        }
      })

      return NextResponse.json({ song });

    } catch (error) {
        console.error("[Downloading SONG POST ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}