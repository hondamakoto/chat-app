const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages') 

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, './public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
 
    // socket.emit('downLinkMessage', 'Welcome!')
    // socket.emit('downLinkMessage', generateMessage('Welcome!'))

    // socket.broadcast.emit('downLinkMessage', 'A new user has joined!')
    // socket.broadcast.emit('downLinkMessage', generateMessage('A new user has joined!'))

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        socket.emit('downLinkMessage', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('downLinkMessage', generateMessage(`${username} has joined!`))

        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
        // socket.emit: A message such as welcome to a new comer
        // socekt.broadcast.emit: A message such as "someone joined" to everyone except the new comer
        // io.emit: A message to everyone

    })



    socket.on('sendMessage', (receivedMessage, callback2) => {
        const filter = new Filter()

        if (filter.isProfane(receivedMessage)) {
            return callback2('Profanity is not allowed!')
        }        
        // console.log('Got a message: ' + receivedMessage)
        // console.log('Got a message')
        // io.emit('downLinkMessage', generateMessage(receivedMessage))
        io.to('nagoya').emit('downLinkMessage', generateMessage(receivedMessage))
        // callback2('Delivered')
        callback2('')
    })

    socket.on('sendLocation', (receivedLocation, callback3) => {
        // io.emit('downLinkLocation', `https://www.google.com/maps?q=${receivedLocation.latitude},${receivedLocation.longitude}`)
        io.emit('downLinkLocation', generateLocationMessage(`https://www.google.com/maps?q=${receivedLocation.latitude},${receivedLocation.longitude}`))
        callback3()
    })

    socket.on('disconnect', () => {
        io.emit('downLinkMessage', generateMessage('A user has left!'))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${ port }!`)
})
