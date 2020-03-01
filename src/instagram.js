const {
    getRandomAyatFairly,
    getScreenshot
} = require('./quran')

const main = ig => async () => {
    console.info('> Preparing surah...')
    const { surah, ayat, translation } = getRandomAyatFairly()
    const caption = `${translation} - QS. ${surah}:${ayat}`
    const file = await getScreenshot(`https://quran.com/${surah}/${ayat}?translations=20`)
    console.info('> Done.\n')

    console.info('> Publishing post...')
    const { latitude, longitude, searchQuery } = {
        // set to jakarta location
        latitude: -6.121435,
        longitude: 106.774124,
        searchQuery: 'indonesia',
    }

    const location = (await ig.search.location(latitude, longitude, searchQuery))[0]
    return ig
        .publish
        .photo({ file, caption, location })
        .then(result => {
            console.log(`> Publishing post done at: ${new Date().toLocaleString()}.\n`)
            return result
        })
}

module.exports = main