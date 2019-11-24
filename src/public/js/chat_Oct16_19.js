const socket = io()

// Challenge 1
// socket.on('welcomeMessage', (message) => {
//     console.log(message)
// })

// Challenge 2

socket.on('downLinkMessage', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

// #1
    // const message = document.querySelector('input').value
// #2
    const message = e.target.elements.messageInput.value
// #3 by me doesn't work...
    // const message = document.getElementsByName('messageInput').value


    socket.emit('sendMessage', message)
})





// Original
// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated!', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })