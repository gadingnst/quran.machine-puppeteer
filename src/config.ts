import Puppeteer from 'puppeteer'
import Env from 'dotenv'

Env.config()

const env = process.env

export const IG_PROXY = env.IG_PROXY
export const IG_USERNAME = env.IG_USERNAME
export const IG_PASSWORD = env.IG_PASSWORD
export const SECRET_CODE = env.SECRET_CODE

export const puppeteer = () => Puppeteer.launch({
    args: ['--no-sandbox'],
    headless: process.env.NODE_ENV !== 'development' 
})
