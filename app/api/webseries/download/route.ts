import puppeteer, { Browser, Page, Target } from 'puppeteer';
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from '@/lib/db';

interface DownloadResponse {
    downloadLink: string | null;
}

async function handleApkPureLink(page: Page, browser: Browser) {
    console.log(`Step 1: Current URL before clicking #lite-human-verif-button: ${page.url()}`);
    await page.waitForSelector('#lite-human-verif-button', { visible: true });
    await new Promise(resolve => setTimeout(resolve, 10000));  // 10-second wait
    await page.click('#lite-human-verif-button');
    console.log("Step 1: Clicked #lite-human-verif-button");

    console.log(`Step 2: Current URL before clicking #lite-start-sora-button: ${page.url()}`);
    await page.waitForSelector('#lite-start-sora-button', { visible: true });
    await new Promise(resolve => setTimeout(resolve, 10000));
    await page.click('#lite-start-sora-button');
    console.log("Step 2: Clicked #lite-start-sora-button");

    console.log(`Step 3: Current URL before clicking #lite-end-sora-button: ${page.url()}`);
    await page.waitForSelector('#lite-end-sora-button', { visible: true });
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Set up listener for the new tab creation, handle case if `target.page()` is null
    const newPagePromise = new Promise<Page>((resolve, reject) => {
        browser.once('targetcreated', async (target: Target) => {
            const newPage = await target.page();
            if (newPage) {
                resolve(newPage);  // Resolve with the new page (new tab) if it exists
            } else {
                reject(new Error("New tab couldn't be opened."));  // Handle the error case
            }
        });
    });

    await page.click('#lite-end-sora-button');
    console.log("Step 3: Clicked #lite-end-sora-button, waiting for new tab...");
    
    try {
        const newTab = await newPagePromise;
        await newTab.bringToFront();  // Focus on the new tab
        const hubcloudLink = newTab.url();
        console.log(`Navigated to new tab: ${hubcloudLink}`);
        return hubcloudLink;
    } catch (error) {
        console.error("Error in handling new tab:", error);
        return null;  // Return null or handle it in some other way if the new tab wasn't created
    }
}

export async function POST(req: Request): Promise<NextResponse<DownloadResponse>> {
    let browser: Browser | undefined;

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

        browser = await puppeteer.launch({ headless: true });
        let page = await browser.newPage();
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log(`Navigated to: ${link}`);

        let hubcloudLink = link;
        if (link.includes('apkpuredrive.com')) {
            hubcloudLink = await handleApkPureLink(page, browser);
        }

        console.log("Final hubcloud link: " + hubcloudLink);
        await page.goto(hubcloudLink, { waitUntil: 'load', timeout: 60000 });

        const response = await page.goto(hubcloudLink);
        if (!response || !response.ok()) {
            console.log('Failed to fetch the Hubcloud page:', response?.status());
            return NextResponse.json({ downloadLink: null });
        }

        const jsContent = await response.text();
        const urlMatch = jsContent.match(/url\s*=\s*['"]([^'"]+)['"]/);
        if (!urlMatch || !urlMatch[1]) {
            console.log('URL variable not found in the script on Hubcloud.');
            return NextResponse.json({ downloadLink: null });
        }

        page = await browser.newPage();
        await page.goto(urlMatch[1], { waitUntil: 'networkidle2', timeout: 60000 });

        const downloadLink = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            const specificLink = links.find(link =>
                link.href.includes('https://pixeldra.in/api/file/') &&
                link.textContent?.includes('Download [PixelServer')
            );
            return specificLink ? specificLink.href : null;
        });

        if (downloadLink) {
            await db.webSeriesEpisode.create({
                data: {
                    profileId: profile.id,
                    episodeName: fileName,
                    episodeURL: downloadLink,
                },
            });
            return NextResponse.json({ downloadLink });
        } else {
            console.log('Download link not found.');
            return NextResponse.json({ downloadLink: null });
        }

    } catch (error) {
        console.error("[DOWNLOADWebSeries POST ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}