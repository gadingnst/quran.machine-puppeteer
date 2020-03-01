require('dotenv').config()
const puppeteer = require('puppeteer')

exports.IG_PROXY = process.env.IG_PROXY
exports.IG_USERNAME = process.env.IG_USERNAME
exports.IG_PASSWORD = process.env.IG_PASSWORD
exports.puppeteer = () => puppeteer.launch({
    args: ['--no-sandbox'],
    headless: process.env.NODE_ENV !== 'development' 
})
