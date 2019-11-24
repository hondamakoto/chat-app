const socket = io()

// Challenge 1
// socket.on('welcomeMessage', (message) => {
//     console.log(message)
// })

// Challenge 2

socket.on('downLinkMessage', (message) => {
    console.log(message)
})

document.querySelector('#submit').addEventListener('click', () => {
    console.log('Clicked')
    let sendMessage = document.getElementById('message').value
    socket.emit('submit', sendMessage)
})





// Original
// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated!', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })