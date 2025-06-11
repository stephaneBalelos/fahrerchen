import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import type { Browser as BigBrowser } from "puppeteer"
import type { Browser as CoreBrowser } from "puppeteer-core";

let browser: BigBrowser | CoreBrowser | null = null

export const generatePDF = async (html: string) => {
    try {
        const browser = await getBrowser()
        if (!browser) {
            throw new Error('Browser not launched')
        }
        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle2' })
        const pdf = await page.pdf({
            format: 'A4',
            landscape: false,
        })

        await browser.close()

        return pdf
    } catch (error) {
        console.error('Error generating PDF:', error)
        throw new Error('Failed to generate PDF')
    }
}

const getBrowser = async () => {
    try {
        if (browser) {
            return browser
        }
        // Lunch the browser with remoteExecutablePath in Production
        // or with local Chromium in Development
        if (process.env.NODE_ENV === 'development') {
            // In development, use the local Chromium executable
            browser = await puppeteer.launch({
                headless: true,
            })
        } else {
            browser = await puppeteerCore.launch({
                headless: true,
                args: chromium.args,
                executablePath: await chromium.executablePath("https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar"),
            })
        }
        return browser
    } catch (error) {
        console.error('Error launching browser:', error)
        throw new Error('Failed to launch browser')
    }
}