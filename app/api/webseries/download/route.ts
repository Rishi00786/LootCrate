import puppeteer from 'puppeteer';
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from '@/lib/db';

// Define the expected response structure
interface DownloadResponse {
    downloadLink: string | null;
}

export async function POST(req: Request): Promise<NextResponse<DownloadResponse>> {
    let browser;

    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { link, fileName } = body;

        if (!link) {
            return new NextResponse("Invalid link", { status: 400 });
        }

        // Launch Puppeteer
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(link);

        const response = await page.goto(link);

        if (!response || !response.ok()) {
            console.log('Failed to fetch the JavaScript file:', response?.status());
            return NextResponse.json({ downloadLink: null });
        }

        const jsContent = await response.text();
        const urlMatch = jsContent.match(/url\s*=\s*['"]([^'"]+)['"]/);

        if (!urlMatch || !urlMatch[1]) {
            console.log('URL variable not found in the script.');
            return NextResponse.json({ downloadLink: null });
        }

        // Navigate to the extracted URL to find the download link
        await page.goto(urlMatch[1]);
        await page.waitForSelector('a');

        const downloadLink = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            const specificLink = links.find(link =>
                link.href.includes('https://pixeldra.in/api/file/') && 
                link.textContent?.includes('Download [PixelServer')
            );
            return specificLink ? specificLink.href : null;
        });

        // Ensure downloadLink is a string before saving to the database
        if (downloadLink) {
            await db.webSeriesEpisode.create({
                data: {
                    profileId: profile.id,
                    episodeName: fileName,
                    episodeURL: downloadLink,
                },
            });
        } else {
            console.log('Download link is null. Episode not saved to the database.');
            return NextResponse.json({ downloadLink: null });
        }

        return NextResponse.json({ downloadLink });

    } catch (error) {
        console.error("[DOWNLOADWebSeries POST ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });

    } finally {
        if (browser) {
            await browser.close();  // Ensure the browser is closed
        }
    }
}
