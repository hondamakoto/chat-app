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

socket.on('downLinkMessage', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('downLinkLocation', (locationMessage) => {
    console.log(locationMessage)
    const htmlLocation = Mustache.render(locationMessageTemplate, {
        locationMessage
    })
    $messages.insertAdjacentHTML('beforeend', htmlLocation)
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

