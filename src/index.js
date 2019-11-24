const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages') 

const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, './public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
 
    // socket.on('join', ({ username, room }, callback) => {
    socket.on('join', (options, callback) => {
        // const { error, user } = addUser({ id: socket.id, username, room })
        const { error, user } = addUser({ id: socket.id, ...options })

        if(error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('downLinkMessage', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('downLinkMessage', generateMessage('Ademin', `${user.username} has joined!`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()

        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
        // socket.emit: A message such as welcome to a new comer
        // socekt.broadcast.emit: A message such as "someone joined" to everyone except the new comer
        // io.emit: A message to everyone

    })



    socket.on('sendMessage', (receivedMessage, callback2) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(receivedMessage)) {
            return callback2('Profanity is not allowed!')
        }        
        // console.log('Got a message: ' + receivedMessage)
        // console.log('Got a message')
        // io.emit('downLinkMessage', generateMessage(receivedMessage))
        // io.to('nagoya').emit('downLinkMessage', generateMessage(receivedMessage))
        // io.to(user.room).emit('downLinkMessage', generateMessage(receivedMessage))
        io.to(user.room).emit('downLinkMessage', generateMessage(user.username, receivedMessage))
        
        // callback2('Delivered')
        callback2('')
    })

    socket.on('sendLocation', (receivedLocation, callback3) => {
        const user = getUser(socket.id)

        // io.emit('downLinkLocation', `https://www.google.com/maps?q=${receivedLocation.latitude},${receivedLocation.longitude}`)
        // io.emit('downLinkLocation', generateLocationMessage(`https://www.google.com/maps?q=${receivedLocation.latitude},${receivedLocation.longitude}`))
        io.to(user.room).emit('downLinkLocation', generateLocationMessage(user.username, `https://www.google.com/maps?q=${receivedLocation.latitude},${receivedLocation.longitude}`))

        callback3()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            // io.to(user.room).emit('downLinkMessage', generateMessage(`${user.username} has left!`))
            io.to(user.room).emit('downLinkMessage', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${ port }!`)
})
