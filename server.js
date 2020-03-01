/* Setting things up. */
const CronJob = require('cron').CronJob
const express = require('express')
const { loginIG } = require('./src/config')
const instagram = require('./src/instagram')

const server = express()
const port = process.env.PORT || 9600

server.use(express.static('public'))

server.listen(port, () => {
    console.info('> Bot running in port:', port)
    console.info('> Posting ayat to Instagram at every hour\n')
    loginIG()
        .then(user => {
            instagram(user)()
            new CronJob('00 59 * * * *', instagram(user), null, true, 'Asia/Jakarta').start()
        })
})
