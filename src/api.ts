import { Router } from 'express'
import { getScreenshot } from './quran'

const route = Router()

route.get('/screenshot/:surah/:ayat', async (req, res) => {
  const { surah, ayat } = req.params;
  try {
    const bufferData = await getScreenshot(`https://quran.com/${surah}/${ayat}?translations=20`) as unknown as Buffer
    const image = Buffer.from(bufferData)
    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': image.length
    })
    res.end(image)
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
})

export default route
