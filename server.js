/* Setting things up. */
const
  path = require('path'),
  express = require('express'),
  app = express(),
  { getRandomAyatFairly } = require('./quran'),
  getScreenshot = require('./screenshot'),
  surahs = [...Array(114)].map((_, i) => i + 1)

app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
)
app.use(express.static('public'))

app.all(`/${process.env.BOT_ENDPOINT}`, async (req, res) => {
  try {
    const { surah, ayat, translation } = getRandomAyatFairly()
    console.log({ surah, ayat, translation })
    const result = await getScreenshot(
      `https://quran.com/${surah}/${ayat}?translations=20`
    )
    
    const
      postfix = `- QS${surah}:${ayat}`,
      maxTextLength = 280 - postfix.length,
      text = translation.length > maxTextLength ? `${translation.slice(0,maxTextLength - 3)}...` : translation,
      status = `${text}${postfix}`

    res.send(200)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

const listener = app.listen(process.env.PORT, () => {
  console.log('Your bot is running on port ' + listener.address().port)
})
