const express = require('express')
const app = express()
const path = require('path')

console.log(__dirname)
console.log(path.join(__dirname, './'))

app.get('/', (req, res) => {
    // res.send('<h1>Chat app</h1>')
    res.sendFile('index.html', {
        // root: path.join(__dirname, './')
        // root: __dirname
        // root: 'C:/Users/Honda/Documents/Udemy_nodejs_v3/node-course/chat-app/src'
        // root: './src/'
        root: path.join(__dirname, './public/')
    })
})

// console.log(__dirname)

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})


