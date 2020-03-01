require('dotenv').config()
const { IgApiClient } = require('instagram-private-api')
const puppeteer = require('puppeteer')

const env = process.env
const IG_PROXY = env.IG_PROXY
const IG_USERNAME = env.IG_USERNAME
const IG_PASSWORD = env.IG_PASSWORD

exports.IG_PROXY = IG_PROXY
exports.IG_USERNAME = IG_USERNAME
exports.IG_PASSWORD = IG_PASSWORD

exports.puppeteer = () => puppeteer.launch({
    args: ['--no-sandbox'],
    headless: process.env.NODE_ENV !== 'development' 
})

exports.loginIG = async () => {
    console.info('> Conecting to Instagram Account..')
    const ig = new IgApiClient()
    IG_PROXY && (ig.state.proxyUrl = IG_PROXY)
    IG_USERNAME && ig.state.generateDevice(IG_USERNAME)
    await ig.account.login(IG_USERNAME, IG_PASSWORD)
    console.info('> Done.\n')
    return ig
}
