import puppeteer from 'puppeteer';
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

// Define the structure of the expected response
interface LinkInfo {
    fileName?: string;
    linkText: string;
    finalLink?: string; // Optional, as it's only relevant for some cases
}

export async function POST(req: Request) {
    let browser

    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { link } = body;

        if (!link) {
            return new NextResponse("Invalid link", { status: 400 });
        }

        const MYdata = process.env.MYDATA;

        if (!MYdata) {
            throw new Error("MYDATA environment variable is not defined");
        }

        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Use the link variable instead of the undefined articleUrl
        await page.goto(link);
        await page.waitForSelector('div.alert');  // Ensure the page has loaded the necessary div elements

        // Extract the information from divs and h3 tags with links
        const finalLinksInfo: Record<string, LinkInfo> = await page.evaluate(() => {
            const results: Record<string, LinkInfo> = {};
        
            const alertDivs = document.querySelectorAll('div.alert.alert-info');
            alertDivs.forEach(div => {
                const pElement = div.querySelector('p');
                if (pElement) {
                    const fileName = pElement.textContent?.trim() || '';
                    const linkElement = div.querySelector('a');
        
                    if (linkElement) {
                        const linkText = linkElement.textContent?.trim() || '';
                        const href = linkElement.href;
        
                        if (!results[fileName] || href.startsWith('https://hubcloud')) {
                            results[fileName] = {
                                fileName,
                                linkText,
                                // finalLink: href // Capture the link if it exists
                            };
                        }
                    }
                }
            });
        
            // Additional extraction from h3 elements if necessary
            if (Object.keys(results).length === 0) {
                const h3Elements = document.querySelectorAll('h3');
                h3Elements.forEach(h3 => {
                    const anchor = h3.querySelector('a');
                    if (anchor) {
                        const strongElement = h3.querySelector('strong');
                        const linkText = strongElement ? strongElement.textContent?.trim() || '' : '';
                        const finalLink = anchor.href;
        
                        if (!results[linkText]) {
                            results[linkText] = {
                                linkText,
                                finalLink
                            };
                        }
                    }
                });
            }
        
            return results; // Return the results
        });
        

        // Return the final extracted links info as JSON
        return NextResponse.json(finalLinksInfo);

    } catch (error) {
        console.error("[SearchQueryWebSeries POST ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });

    } finally {
        if (browser) {
            await browser.close();  // Ensure the browser is closed
        }   
    }
}