const puppeteer = require('puppeteer')

async function getScreenshot(url, type = 'png') {
  console.log({ url, type })
  const browser = await puppeteer.launch({
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.goto(url)
  await autoScroll(page)
  const file = await screenshotAyat(page, type)
  await browser.close()
  return file
}

async function screenshotAyat(page, type) {
  const ayat = await page.$('#bismillah + div')
  return ayat.screenshot({ type })  
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0
      const 
        distance = 100,
        timer = setInterval(() => {
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

module.exports = getScreenshot
