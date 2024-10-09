import puppeteer from 'puppeteer-core'; // Use puppeteer-core
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { executablePath } from 'puppeteer'; // Import executablePath for serverless environments

export async function POST(req: Request) {
    let browser;

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

        // Launch Puppeteer
        try {
            browser = await puppeteer.launch({
                headless: true,
                executablePath: executablePath(), // Specify executable path for serverless environments
                args: ['--no-sandbox', '--disable-setuid-sandbox'], // Workaround for serverless
            });
        } catch (launchError) {
            console.error('Puppeteer launch failed:', launchError);
            return new NextResponse("Internal Server Error: Puppeteer failed to launch", { status: 500 });
        }

        const page = await browser.newPage();
        await page.goto(MYdata);

        // Perform search
        await page.type('input[name="s"]', searchQueryMovies);  // Ensure the selector is correct
        await page.keyboard.press('Enter');

        // Wait for results
        await page.waitForNavigation(); // Or await page.waitForSelector('selector-for-search-results');

        // Extract data
        const articles = await page.evaluate(() => {
            const results: { title: string; link: string }[] = [];
            document.querySelectorAll('article a').forEach(anchor => {
                const title = anchor.getAttribute('title');
                const link = anchor.getAttribute('href');
                if (title && link) {
                    results.push({ title, link });
                }
            });
            return results;
        });

        // Return the search query data and scraped articles
        return NextResponse.json({ searchedQuery, articles });

    } catch (error) {
        console.error("[SearchQueryMoviesArticles POST ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    } finally {
        if (browser) {
            await browser.close(); // Ensure browser is closed
        }
    }
}