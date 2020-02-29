const { getRandomAyatFairly, getScreenshot } = require('./quran')

async function main() {
    const { surah, ayat, translation } = getRandomAyatFairly()
    const result = await getScreenshot(`https://quran.com/${surah}/${ayat}?translations=20`)
    const caption = `${translation} - QS. ${surah}:${ayat}`
}

main()