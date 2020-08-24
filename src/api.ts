import { Router } from 'express'
import { SECRET_CODE } from './config'
import { publishPost } from './instagram'

const route = Router()

route.get('/publish', async (req, res) => {
  const { secret } = req.query
  if (secret !== SECRET_CODE) {
    return res.status(403).send({
      code: 403,
      message: 'Access Forbidden.',
      error: false
    })
  }

  /* prevent 502 in vercel, request timeout on 10 seconds */
  let processing = true
  setTimeout(() => {
    if (processing) {
      processing = false
      return res.status(301).send({
        code: 301,
        message: 'Request timeout! Process still running but request exited.',
        error: false
      })
    } 
  }, 9250)

  try {
    await publishPost()
    return processing && res.status(201).send({
      code: 201,
      message: 'Success Publishing Post!',
      error: false
    })
  } catch (reason) {
    const { aspectRatioError, surah, ayat } = reason
    
    if (aspectRatioError) {
      return processing && res.status(503).send({
        code: 503,
        message: `Cannot publish surah because aspect ratio not match with instagram. On: Q.S. ${surah}:${ayat}`,
        error: true
      })
    }
    
    return processing && res.status(500).send({
      code: 500,
      message: 'Something went wrong, try again later.',
      error: reason
    })
  } finally {
    processing = false
  }

})

export default route