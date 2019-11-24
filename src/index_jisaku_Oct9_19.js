const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, './public')

app.use(express.static(publicDirectoryPath))

// Original
let count= 0

// Challenge 1
// let message = 'Welcome!'

// Challenge 2
let sendMessage = ''


io.on('connection', (socket) => {
// Challenge 1
    // console.log('New WebSocket connection')
    // socket.emit('welcomeMessage', message)

// Challenge 2
    console.log('In connection')
    socket.on('submit', (sendMessage) => {
        console.log('Got a message: ' + sendMessage)
        // console.log('Got a message')
        io.emit('downLinkMessage', sendMessage)
        // io.emit('downLinkMessage', 'Test message')
    })

// Original
    // socket.emit('countUpdated', count)
    // socket.on('increment', () => {
    //     count++
    //     // For a single client connection
    //     // socket.emit('countUpdated', count)
    //     // For every client connection
    //     io.emit('countUpdated', count)
    // })

})

server.listen(port, () => {
    console.log(`Server is up on port ${ port }!`)
})
