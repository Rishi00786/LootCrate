import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { searchQueryMovies } = body;

        if (!searchQueryMovies) {
            return new NextResponse("Invalid search query", { status: 400 });
        }

        // Log search query in DB
        const searchedQuery = await db.searchQueryMovies.create({
            data: {
                query: searchQueryMovies,
                profileId: profile.id,
            }
        });

        const MYdata = process.env.MYDATA;
        if (!MYdata) {
            throw new Error("MYDATA environment variable is not defined");
        }

        // Fetch page content
        const response = await axios.get(MYdata, {
            params: {
                s: searchQueryMovies, // Append search query
            }
        });

        const html = response.data;
        const $ = cheerio.load(html); // Load HTML into Cheerio
        
        // Extract data
        const articles: { title: string; link: string; }[] = [];
        $('article a').each((_, element) => {
            const title = $(element).attr('title');
            const link = $(element).attr('href');
            if (title && link) {
                articles.push({ title, link });
            }
        });

        // Return the search query data and scraped articles
        return NextResponse.json({ searchedQuery, articles });
        
    } catch (error) {
        console.error("[SearchQueryMoviesArticles POST ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}