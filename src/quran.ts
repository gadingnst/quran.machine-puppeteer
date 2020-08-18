// Key: {surah}.{ayat}
// Value: translation

import Jimp from 'jimp'
import { puppeteer } from './config'
import { Page } from 'puppeteer'

type ImageType = 'jpeg'|'png'
type QuranJSON = {
  [key: string]: string
}

const quran: QuranJSON = require('../quran.json')

async function screenshotAyat(page: Page, type: ImageType) {
  const ayat = await page.$('#bismillah + div')
  return ayat?.screenshot({ type })
}

async function autoScroll(page: Page) {
  await page.evaluate(async () => new Promise(resolve => {
    let totalHeight = 0
    const distance = 100
    const timer = setInterval(() => {
      const scrollHeight = document.body.scrollHeight
      window.scrollBy(0, distance)
      totalHeight += distance
      if (totalHeight >= scrollHeight) {
        clearInterval(timer)
        resolve()
      }
    }, 100)
  }))
}

export async function getScreenshot(url: string, type: ImageType = 'jpeg') {
  const browser = await puppeteer()
  try {
    const page = await browser.newPage()
    await page.setViewport({
      width: 640,
      height: 480,
      deviceScaleFactor: 1
    })
    await page.goto(url, { waitUntil: 'load', timeout: 0 })
    await autoScroll(page)
    const file = await screenshotAyat(page, type)
    const resizedFile = await Jimp.read(file as Buffer)
    return resizedFile
      .scaleToFit(500, Jimp.AUTO, Jimp.RESIZE_BEZIER)
      .getBufferAsync(Jimp.AUTO as any)
  } catch (err) {
    console.error(err)
  } finally {
    browser.close()
  }
}

export const getRandomAyatFairly = () => {
  const flatAyats = Object.entries(quran)
  const [key, translation] = flatAyats[~~(Math.random() * flatAyats.length)]
  const [surah, ayat] = key.split('.')
  return { surah, ayat, translation }
}

export default {
  getRandomAyatFairly,
  getScreenshot
}