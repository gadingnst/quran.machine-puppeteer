/* Setting things up. */
const CronJob = require('node-cron')
const express = require('express')
const { loginIG } = require('./src/config')
const instagram = require('./src/instagram')

const server = express()
const port = process.env.PORT || 9600

server.use(express.static('public'))

server.listen(port, () => {
    console.info('> Bot running in port:', port)
    console.info('> Posting ayat to Instagram every 3 hours\n')
    loginIG()
        .then(user => {
            CronJob.schedule('0 0 */3 * * *', instagram(user))
            return instagram(user)()
        })
})
