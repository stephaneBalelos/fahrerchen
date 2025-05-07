import * as pupperteer from "puppeteer"


export const generatePDF = async (html: string) => {
    try {
        const browser = await pupperteer.launch()
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