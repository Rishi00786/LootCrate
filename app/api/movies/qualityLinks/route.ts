import puppeteer from 'puppeteer';
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

interface DownloadInfo {
    seasonInfo: string[];
    googleDriveLink: string;
}

export async function POST(req: Request) {
    let browser;

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

        // Launch puppeteer and open a new browser page
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Navigate to the provided article link
        await page.goto(link);
        await page.waitForSelector('h3'); // Wait for h3 elements to load

        // Scrape the season information and Google Drive link
        const downloadInfo: DownloadInfo[] = await page.evaluate(() => {
            const results: DownloadInfo[] = [];
            const h3Elements = document.querySelectorAll('h3');

            h3Elements.forEach((h3) => {
                // Extract text from span elements inside the h3
                const seasonInfo = Array.from(h3.querySelectorAll('span')).map((span) => span.textContent?.trim() || "");

                // Get the next sibling 'p' tag after the h3
                const pElement = h3.nextElementSibling as HTMLElement | null;

                if (pElement?.tagName === 'P') {
                    // Find the first anchor tag with the desired title attribute
                    const firstAnchor = pElement.querySelector<HTMLAnchorElement>('a[title^="✔ Fast Gdrive & Direact Faster Links (No Login Required)"]');

                    if (firstAnchor?.href) {
                        const googleDriveLink = firstAnchor.href; // Extract Google Drive link
                        results.push({ seasonInfo, googleDriveLink });
                    }
                }
            });

            return results;
        });

        // Close the browser after scraping
        await browser.close();

        // Return the scraped data as JSON response
        return NextResponse.json({ downloadInfo });

    } catch (error) {
        console.error("[FETCHING QUALITY LINKS POST ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });

    } finally {
        // Ensure browser is closed even if an error occurs
        if (browser) {
            await browser.close();
        }
    }
}