// Key: {surah}.{ayat}
// Value: translation

const { puppeteer } = require('./config')
const quran = require('../quran.json')

async function getScreenshot(url, type = 'jpeg') {
  const browser = await puppeteer()
  const page = await browser.newPage()
  await page.setViewport({
    width: 640,
    height: 480,
    deviceScaleFactor: 1
  })
  await page.goto(url, { waitUntil: 'load', timeout: 0 })
  await autoScroll(page)
  const file = await screenshotAyat(page, type)
  await browser.close()
  return file
}

async function screenshotAyat(page, type) {
  const ayat = await page.$('#bismillah + div')
  return ayat.screenshot({
    type
  })
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
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
    })
  })
}

const getRandomAyatFairly = () => {
  const flatAyats = Object.entries(quran)
  const [key, translation] = flatAyats[~~(Math.random() * flatAyats.length)]
  // flatAyats.find(a => a[0] === '96.1') # iqra

  const [surah, ayat] = key.split('.')
  return { surah, ayat, translation }
}

module.exports = {
  getRandomAyatFairly,
  getScreenshot
}