import puppeteer from 'puppeteer'
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    let browser;

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

        // Log search query in DB
        const searchedQuery = await db.searchQueryWebSeries.create({
          data: {
            query: searchQuery,
            profileId: profile.id,
          }
        });

        const MYdata = process.env.MYDATA ; 

        if (!MYdata) {
            throw new Error("MYDATA environment variable is not defined");
        }

        // Launch Puppeteer
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(MYdata);
        
        // Perform search
        await page.type('input[name="s"]', searchQuery);  // Ensure the selector is correct
        await page.keyboard.press('Enter');
        
        // Wait for results (you may need to adjust this based on page behavior)
        await page.waitForNavigation(); // Or: await page.waitForSelector('selector-for-search-results');
        
        // Extract data
        const articles = await page.evaluate(() => {
            const results: { title: string; link: string }[] = [];
            document.querySelectorAll('article a').forEach(anchor => {
                const title = anchor.getAttribute('title');  // Get the title
                const link = anchor.getAttribute('href');  // Get the article link
                if (title && link) {
                    results.push({ title, link });
                }
            });
            return results;
        });

        // Close the browser
        await browser.close();

        // Return the search query data and scraped articles
        return NextResponse.json({ searchedQuery, articles });
  
    } catch (error) {
        console.error("[SearchQueryWebSeries POST ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
  
    } finally {
        if (browser) {
            await browser.close();  // Ensure the browser is closed
        }
    }
}