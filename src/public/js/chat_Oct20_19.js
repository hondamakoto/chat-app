const socket = io()


socket.on('downLinkMessage', (message) => {
    console.log(message)
})

socket.on('downLinkLocation', (downLocationMessage) => {
    console.log(downLocationMessage)
})


document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.messageInput.value

    socket.emit('sendMessage', message, (callbackedMessage) => {        
        // console.log('The following message was delivered from index.js: ', callbackedMessage)
        if (callbackedMessage) {
            return console.log(callbackedMessage)
        }

        console.log('Message delivered!')

    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log('Latitude: ' + position.coords.latitude)
        // console.log('Longitude: ' + position.coords.longitude)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        })
    })
})

