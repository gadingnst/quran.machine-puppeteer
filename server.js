/* Setting things up. */
const express = require('express')
const instagram = require('./src/instagram')

const server = express()
const port = process.env.PORT || 9600

server.use(express.static('public'))

server.listen(port, () => {
    console.info('Bot running in port:', port)
})
