import { Router } from 'express'
import { SECRET_CODE } from './config'
import { publishPost } from './instagram'

const route = Router()

route.get('/publish', async (req, res) => {
  const { secret } = req.query
  let settled = false

  if (secret !== SECRET_CODE) {
    return res.status(403).send({
      code: 403,
      message: 'Access Forbidden.',
      error: false
    })
  }

  /* prevent 502 in vercel, request timeout on 10 seconds */
  setTimeout(() => {
    return !settled && res.status(301).send({
      code: 301,
      message: 'Request timeout! Process still running but request exited.',
      error: false
    })
  }, 9000)

  try {
    await publishPost()
    settled = true
    return res.status(201).send({
      code: 201,
      message: 'Success Publishing Post!',
      error: false
    })
  } catch (reason) {
    const { aspectRatioError, surah, ayat } = reason
    settled = true
    
    if (aspectRatioError) {
      return res.status(503).send({
        code: 503,
        message: `Cannot publish surah because aspect ratio not match with instagram. On: Q.S. ${surah}:${ayat}`,
        error: true
      })
    }
    
    return res.status(500).send({
      code: 500,
      message: 'Something went wrong, try again later.',
      error: reason
    })
  }

})

export default route