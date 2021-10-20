import { IS_PRODUCTION, puppeteer } from './config'
import { Page } from 'puppeteer'

export type ImageType = 'jpeg'|'png'

const setPageWidth = (page: Page, width: number) => page.setViewport({
  width,
  height: 680,
  deviceScaleFactor: 1
})

async function screenshotAyat(page: Page, type: ImageType) {
  const ayat = await page.$('main')
  const height = await page.evaluate(() => {
    const target = document.querySelector('#verses-translation')
    const settings: any = document.querySelector('main > div.surah-actions div.nav-button')
    const readingButtons: any = document.querySelector('#verses-translation_pagination')
    settings && (settings.style.display = 'none')
    readingButtons && (readingButtons.style.display = 'none')
    return target?.scrollHeight
  }) || 0

  if (height > 1000) {
    await setPageWidth(page, 1600)
  } else if (height > 500) {
    await setPageWidth(page, 1280)
  } else if (height < 350) {
    await setPageWidth(page, 480)
  }

  return ayat?.screenshot({ type })
}

export async function getScreenshot(url: string, mode = 'dark', type: ImageType = 'png') {
  const browser = await puppeteer()
  try {
    const page = await browser.newPage()
    await setPageWidth(page, 640)
    await page.goto(url, { waitUntil: 'load', timeout: 0 })
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: mode === 'dark' ? mode : 'light' }
    ])
    const image = await screenshotAyat(page, type)
    return image
  } catch (err) {
    console.error(err)
  } finally {
    IS_PRODUCTION && browser.close()
  }
}

const Quran = {
  getScreenshot
}

export default Quran
