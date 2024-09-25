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
      const { searchQuery } = body;
  
      if (!searchQuery) {
        return new NextResponse("Invalid search query", { status: 400 });
      }
  
    //   console.log(searchQuery);
    //   console.log(db.searchQuery)
  
      const searchedQuery = await db.searchQuery.create({
        data: {
          query: searchQuery,
          profileId: profile.id,
        }
      })

      const apiKey = process.env.YOUTUBE_API_KEY;

      if (!apiKey) {
        return NextResponse.json({ error: 'API key not set' }, { status: 500 });
      }

      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      return NextResponse.json({ searchedQuery, youtubeResults: data.items || [] });

    } catch (error) {
      console.error("[SearchQuery POST ERROR]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
  