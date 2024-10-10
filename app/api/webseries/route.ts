/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

let chrome: any, puppeteer: any;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

export async function POST(req: Request) {
  let browser: any;

  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { searchQuerySeries } = body;

    if (!searchQuerySeries) {
      return new NextResponse("Invalid search query", { status: 400 });
    }

    // Log search query in DB
    const searchedQuery = await db.searchQueryWebSeries.create({
      data: {
        query: searchQuerySeries,
        profileId: profile.id,
      },
    });

    const MYdata = process.env.MYDATA;

    if (!MYdata) {
      throw new Error("MYDATA environment variable is not defined");
    }

    let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      options = {
        args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      };
    } else {
      options = {
        headless: true,
      };
    }

    // Launch Puppeteer
    browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    await page.goto(MYdata);

    // Perform search
    await page.type('input[name="s"]', searchQuerySeries);
    await page.keyboard.press('Enter');

    // Wait for results
    await page.waitForNavigation();

    // Extract data
    const articles = await page.evaluate(() => {
      const results: { title: string; link: string }[] = [];
      document.querySelectorAll("article a").forEach((anchor) => {
        const title = anchor.getAttribute("title");
        const link = anchor.getAttribute("href");
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
      await browser.close();
    }
  }
}