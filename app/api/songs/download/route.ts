// be3345ff31msh3711086a36d92d8p15852bjsnb45c01a692b9
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { videoURL, videoTitle, videoId } = body;

    if (!videoURL || !videoId) { // Validate videoId as well
      return new NextResponse("Invalid input", { status: 400 });
    }

    const options = {
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id: videoId },
      headers: {
        'x-rapidapi-key': 'be3345ff31msh3711086a36d92d8p15852bjsnb45c01a692b9', // Use environment variable
        'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    const downloadLink = response.data.link; // Adjust according to the actual response structure

    // Save song information in the database

    let song;
    if(downloadLink){
      song = await db.songs.create({
        data: {
          songURL: videoURL, // Store the download link in your DB
          songTitle: videoTitle,
          profileId: profile.id,
        },
      });
    }
    

    return NextResponse.json({ song, downloadLink }); // Return the download link

  } catch (error) {
    console.error("[Downloading SONG POST ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
