import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import axios from 'axios';
import * as cheerio from 'cheerio';

interface DownloadInfo {
    seasonInfo: string[];
    googleDriveLink: string;
}

export async function POST(req: Request) {
    try {
        // Get the current user profile
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Parse the request body
        const body = await req.json();
        const { link }: { link: string } = body;

        if (!link) {
            return new NextResponse("Invalid input", { status: 400 });
        }

        // Fetch the HTML content of the page using axios
        const { data } = await axios.get(link);

        // Load the HTML into Cheerio
        const $ = cheerio.load(data);

        // Scrape the season information and Google Drive link
        const downloadInfo: DownloadInfo[] = [];

        $('h3').each((index, h3) => {
            const seasonInfo = $(h3).find('span').map((_, span) => $(span).text().trim()).get();

            // Get the next sibling 'p' tag after the h3
            const pElement = $(h3).next('p');

            // Find the first anchor tag with the desired title attribute
            const googleDriveLink = pElement.find('a[title^="✔ Fast Gdrive & Direact Faster Links (No Login Required)"]').attr('href');

            if (googleDriveLink) {
                downloadInfo.push({ seasonInfo, googleDriveLink });
            }
        });

        // Return the scraped data as JSON response
        return NextResponse.json({ downloadInfo });

    } catch (error) {
        console.error("[FETCHING QUALITY LINKS POST ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}