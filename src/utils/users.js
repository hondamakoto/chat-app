const users = []
// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }
    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

// Store user
const user = { id, username, room }
users.push(user)
return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

// Create getUser
// Input: id
// Output: user object

const getUser = (id) => {
    return users.find((element) => element.id === id)
}

// Create getUsersInRoom
// Input: room name
// Output: array of users

const getUsersInRoom = (roomNameInput) => {
    const roomName = roomNameInput.trim().toLowerCase()
    return users.filter((element) => element.room === roomName)
}



// addUser({
//     id: 22,
//     username: 'Michael',
//     room: 'Redwood City'
// })

// addUser({
//     id: 42,
//     username: 'Jackson',
//     room: 'Redwood City'
// })

// addUser({
//     id: 32,
//     username: 'Micahel',
//     room: 'Menlo Park'
// })

// console.log('Users: ')
// console.log(users)

// const getUserOut = getUser(132)
// console.log('getUserOut')
// console.log(getUserOut)

// console.log('getUser')
// console.log(getUser(32))

// console.log('getUsersInRoom')
// console.log(getUsersInRoom('Menlo park'))

// const removedUser = removeUser(32)

// console.log('Removed user: ')
// console.log(removedUser)

// console.log('Result: ')
// console.log(users)

module.exports = {
addUser,
getUser,
getUsersInRoom,
removeUser
}