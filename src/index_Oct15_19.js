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
// let count= 0

// Challenge 1
// let message = 'Welcome!'


io.on('connection', (socket) => {
// Challenge 1
    // console.log('New WebSocket connection')
    // socket.emit('welcomeMessage', message)

// Challenge 2
    console.log('New WebSocket connection')
    socket.emit('downLinkMessage', 'Welcome!')
    socket.on('sendMessage', (receivedMessage) => {
        console.log('Got a message: ' + receivedMessage)
        // console.log('Got a message')
        io.emit('downLinkMessage', receivedMessage)
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
