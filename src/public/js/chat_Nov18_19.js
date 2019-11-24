const socket = io()

// Element
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargine = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargine
    // console.log(newMessageStyles)
    // console.log(newMessageMargine)

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on('downLinkMessage', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('downLinkLocation', (locationMessage) => {
    console.log(locationMessage)
    const htmlLocation = Mustache.render(locationMessageTemplate, {
        username: locationMessage.username,
        locationMessageUrl: locationMessage.locationUrl,
        createdAt: moment(locationMessage.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', htmlLocation)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    // console.log(room)
    // console.log(users)
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

// document.querySelector('#message-form').addEventListener('submit', (e) => {
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
// Disable
    // console.log('$messageFormButton: ' + $messageFormButton)
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.messageInput.value

    socket.emit('sendMessage', message, (callbackedMessage) => {
// Enable 
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        // console.log('The following message was delivered from index.js: ', callbackedMessage)
        if (callbackedMessage) {
            return console.log(callbackedMessage)
        }

        console.log('Message delivered!')

    })
})

// document.querySelector('#send-location').addEventListener('click', () => {
$sendLocationButton.addEventListener('click', () => {
    // console.log('$sendLocation: ' + $sendLocation)
    // console.log('$sendLocationButton: ' + $sendLocationButton)

    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log('Latitude: ' + position.coords.latitude)
        // console.log('Longitude: ' + position.coords.longitude)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }

})