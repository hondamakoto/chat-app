const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

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

    socket.on('sendMessage', (receivedMessage, callback2) => {
        const filter = new Filter()

        if (filter.isProfane(receivedMessage)) {
            return callback2('Profanity is not allowed!')
        }        
        // console.log('Got a message: ' + receivedMessage)
        // console.log('Got a message')
        io.emit('downLinkMessage', receivedMessage)
        // callback2('Delivered')
        callback2('')
    })

    socket.on('sendLocation', (receivedLocation, callback3) => {
        // io.emit('downLinkLocation', `Location: ${receivedLocation.latitude}, ${receivedLocation.longitude}`)
        // io.emit('downLinkLocation', `https://www.google.com/maps?q=${receivedLocation.latitude},${receivedLocation.longitude}`)
        // io.emit('downLinkMessage', `https://www.google.com/maps?q=${receivedLocation.latitude},${receivedLocation.longitude}`)
        // callback3()
        io.emit('downLinkLocation', `https://www.google.com/maps?q=${receivedLocation.latitude},${receivedLocation.longitude}`)
        callback3()
    })

    socket.on('disconnect', () => {
        io.emit('downLinkMessage', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${ port }!`)
})
