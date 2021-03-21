import Chrome from 'chrome-aws-lambda'
import Env from 'dotenv'

Env.config()

export const {
    NODE_ENV,
    IG_PROXY,
    IG_USERNAME,
    IG_PASSWORD,
    SECRET_CODE
} = process.env

export const IS_PRODUCTION = NODE_ENV !== 'development'
export const COOKIES_PATH = __dirname + '/cookies.json'

export const puppeteer = async () => {
    const executablePath = await Chrome.executablePath
    return Chrome.puppeteer.launch({
        executablePath,
        args: Chrome.args,
        headless: IS_PRODUCTION,
        ignoreHTTPSErrors: true
    })
}
