import puppeteer, { Browser, Page, Target } from 'puppeteer';
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from '@/lib/db';

interface DownloadResponse {
    downloadLink: string | null;
}

async function solveHubCloudLink(hubcloudLink: string, page: Page, browser: Browser): Promise<string | null> {
    try {
        await page.goto(hubcloudLink, { waitUntil: 'networkidle0', timeout: 60000 });
        console.log("on hubcloud")

        const response = await page.goto(hubcloudLink);
        if (!response || !response.ok()) {
            console.log('Failed to fetch the Hubcloud page:', response?.status());
            return null;
        }

        const jsContent = await response.text();
        const urlMatch = jsContent.match(/url\s*=\s*['"]([^'"]+)['"]/);

        if (!urlMatch || !urlMatch[1]) {
            console.log('URL variable not found in the script on Hubcloud.');
            return null;
        }

        console.log("Extracted URL:", urlMatch[1]);
        const newPage = await browser.newPage();
        await newPage.goto(urlMatch[1], { waitUntil: 'networkidle0', timeout: 60000 });

        const downloadLink = await newPage.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            const specificLink = links.find(link =>
                link.href.includes('https://pixeldra.in/api/file/')
            );
            return specificLink ? specificLink.href : null;
        });

        if (downloadLink) {
            console.log('Final Download Link:', downloadLink);
            return downloadLink;
        } else {
            console.log('Download link not found.');
            return null;
        }

    } catch (error) {
        console.error("Error during HubCloud processing:", error);
        return null;
    }
}

async function handleApkPureLink(page: Page, browser: Browser): Promise<string | null> {
    try {
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

        // Set up listener for the new tab creation
        const newPagePromise = new Promise<Page>((resolve, reject) => {
            browser.once('targetcreated', async (target: Target) => {
                const newPage = await target.page();
                if (newPage) {
                    resolve(newPage);  // Resolve with the new page (new tab) if it exists
                } else {
                    reject(new Error("New tab couldn't be opened."));  // Handle error
                }
            });
        });

        await page.click('#lite-end-sora-button');
        console.log("Step 3: Clicked #lite-end-sora-button, waiting for new tab...");

        const newTab = await newPagePromise;
        await newTab.bringToFront();  // Focus on the new tab
        const hubcloudLink = newTab.url();
        console.log(`Navigated to new tab: ${hubcloudLink}`);
        return hubcloudLink;

    } catch (error) {
        console.error("Error in handling new tab:", error);
        return null;
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
        const page = await browser.newPage();
        await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log(`Navigated to: ${link}`);

        // Extract buttons for HubCloud or FilePress
        const buttons = await page.$$eval('a', buttons =>
            buttons.map(button => ({
                text: button.textContent?.trim() || '',  // Handling null textContent
                href: button.href
            }))
        );

        // Filter buttons for HubCloud or FilePress
        const hubcloudButton = buttons.find(button => button.text.includes('HubCloud'));
        const filepressButton = buttons.find(button => button.text.includes('Filepress') || button.text.includes('Direct'));

        let targetLink: string | undefined;
        if (hubcloudButton) {
            targetLink = hubcloudButton.href;
            console.log(`Found HubCloud link: ${targetLink}`);
        } else if (filepressButton) {
            targetLink = filepressButton.href;
            console.log(`Found FilePress link: ${targetLink}`);
        } else {
            console.log('No HubCloud or FilePress button found');
            return new NextResponse("No valid button found", { status: 400 });
        }

        // Navigate to the target page (HubCloud or FilePress)
        await page.goto(targetLink, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log(`Navigated to target page: ${targetLink}`);

        // Handle APKPure verification process if required
        const finalDownloadLink = await handleApkPureLink(page, browser);
        if (!finalDownloadLink) {
            return new NextResponse("Failed to process download link", { status: 500 });
        }

        console.log("Final processed link: " + finalDownloadLink);

        // Ensure the finalDownloadLink is a valid string, or return a default value (empty string, error message, etc.)
        let validDownloadLink = finalDownloadLink || 'No valid link found';

        // Handle HubCloud or FilePress link
        if (validDownloadLink.includes('hubcloud')) {
            validDownloadLink = await solveHubCloudLink(validDownloadLink, page, browser) || validDownloadLink;

            // Save the download link to the database
            await db.movies.create({
                data: {
                    profileId: profile.id,
                    movieName: fileName,
                    movieURL: validDownloadLink,
                },
            });
        }

        return NextResponse.json({ downloadLink: validDownloadLink });

    } catch (error) {
        console.error("[DOWNLOADWebSeries POST ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });

    } finally {
        if (browser) {
            await browser.close();
        }
    }
}