const { IgApiClient } = require('instagram-private-api')

const {
    IG_PROXY,
    IG_USERNAME,
    IG_PASSWORD
} = require('./config')

const {
    getRandomAyatFairly,
    getScreenshot
} = require('./quran')

const login = ig => {
    IG_PROXY && (ig.state.proxyUrl = IG_PROXY)
    IG_USERNAME && ig.state.generateDevice(IG_USERNAME)
    return ig.account.login(IG_USERNAME, IG_PASSWORD)
}

async function main() {
    console.info('> Preparing surah...')
    const ig = new IgApiClient()
    const { surah, ayat, translation } = getRandomAyatFairly()
    const caption = `${translation} - QS. ${surah}:${ayat}`
    const file = await getScreenshot(`https://quran.com/${surah}/${ayat}?translations=20`)
    console.info('> Done.\n')

    console.info('> Conecting to Instagram Account..')
    await login(ig)
    console.info('> Done.\n')

    console.log('> Publishing post...')
    const {
        latitude,
        longitude,
        searchQuery
    } = {
        latitude: 0.0,
        longitude: 0.0,
        searchQuery: 'place',
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