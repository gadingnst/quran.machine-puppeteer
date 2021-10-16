import Chrome from 'chrome-aws-lambda'

export const { NODE_ENV } = process.env
export const IS_PRODUCTION = NODE_ENV !== 'development'

export const puppeteer = async () => {
  const executablePath = await Chrome.executablePath
  return Chrome.puppeteer.launch({
    executablePath,
    args: Chrome.args,
    headless: IS_PRODUCTION,
    ignoreHTTPSErrors: true
  })
}
