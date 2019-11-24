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

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
 
    socket.emit('downLinkMessage', 'Welcome!')
    socket.broadcast.emit('downLinkMessage', 'A new user has joined!')

    socket.on('sendMessage', (receivedMessage) => {
        console.log('Got a message: ' + receivedMessage)
        // console.log('Got a message')
        io.emit('downLinkMessage', receivedMessage)
    })

    socket.on('sendLocation', (receivedLocation) => {
        // io.emit('downLinkLocation', `Location: ${receivedLocation.latitude}, ${receivedLocation.longitude}`)
        io.emit('downLinkLocation', `https://www.google.com/maps?q=${receivedLocation.latitude},${receivedLocation.longitude}`)
    })

    socket.on('disconnect', () => {
        io.emit('downLinkMessage', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${ port }!`)
})
