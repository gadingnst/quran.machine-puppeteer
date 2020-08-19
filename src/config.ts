import Chrome from 'chrome-aws-lambda'
import Puppeteer from 'puppeteer-core'
import Env from 'dotenv'

Env.config()

const env = process.env

export const IG_PROXY = env.IG_PROXY
export const IG_USERNAME = env.IG_USERNAME
export const IG_PASSWORD = env.IG_PASSWORD
export const SECRET_CODE = env.SECRET_CODE
export const COOKIES_PATH = __dirname + '/cookies.json'

export const puppeteer = () => Chrome.executablePath
    .then(executablePath => Puppeteer.launch({
        executablePath,
        args: Chrome.args,
        headless: env.NODE_ENV !== 'development',
        ignoreHTTPSErrors: true
    }))
