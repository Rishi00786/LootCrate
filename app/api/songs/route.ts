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

      return NextResponse.json(searchedQuery);

    } catch (error) {
      console.error("[SearchQuery POST ERROR]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
  