// Key: {surah}.{ayat}
// Value: translation

import Jimp from 'jimp'
import { puppeteer } from './config'
import { Page } from 'puppeteer'

export type ImageType = 'jpeg'|'png'

export type QuranJSON = {
  [key: string]: {
    surah: {
      arab: string
      latin: string
      id: string
    },
    text: {
      arab: string,
      id: string
    },
    tafsir: {
      short: string
      long: string
    }
  }
}

const quran: QuranJSON = require('../quran-tafsir.json')

const setPageWidth = (page: Page, width: number) => page.setViewport({
  width,
  height: 680,
  deviceScaleFactor: 1
})

async function screenshotAyat(page: Page, type: ImageType) {
  const ayat = await page.$('div#verses > div.verse')
  const height = await page.evaluate(() => {
    const target = document.querySelector('.verse .row')
    const header: any = document.querySelector('header.sticky-top')
    const actionBar: any = document.querySelector('section.surah-actions.sticky-top')
    const floatTool: any = document.querySelector('div.verse-actions-below > div.col-md-1')
    console.log({ target, header, actionBar, floatTool })
    actionBar && (actionBar.style.display = 'none')
    header && (header.style.display = 'none')
    floatTool && (floatTool.style.display = 'none')
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

export async function getScreenshot(url: string, type: ImageType = 'jpeg') {
  const browser = await puppeteer()
  const possibleColors = ['red', 'green', 'blue']
  try {
    const page = await browser.newPage()
    await setPageWidth(page, 640)
    await page.goto(url, { waitUntil: 'load', timeout: 0 })
    const file = await screenshotAyat(page, type)
    const image = await Jimp.read(file as Buffer)
    return image
      .color([{
        apply: <any>possibleColors[~~(Math.random() * possibleColors.length)],
        params: [~~(Math.random() * 100)]
      }])
      .getBufferAsync(Jimp.AUTO as any)
  } catch (err) {
    console.error(err)
  } finally {
    // browser.close()
  }
}

export const getRandomAyatFairly = () => {
  const flatAyats = Object.entries(quran)
  const [key, value] = flatAyats[~~(Math.random() * flatAyats.length)]
  const [surah, ayat] = key.split('.')
  const {
    surah: { latin: nameSurah, id: nameSurahId },
    text: { id: translation },
    tafsir: { short: tafsir }
  } = value
  return {
    surah,
    ayat,
    nameSurah,
    nameSurahId,
    translation,
    tafsir
  }
}

export default {
  getRandomAyatFairly,
  getScreenshot
}
