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

    // console.log(index)
    // console.log(users[1])
    // if (index) {
    //     delete users[index]
    // }
}


addUser({
    id: 23,
    username: 'Michael',
    room: 'Redwood City'
})

console.log(users)

const res = addUser({
    id: 33,
    username: '',
    room: ''
})

console.log(res)

const res2 = addUser({
    id: 88,
    username: 'Jackson',
    room: 'Menlo Park'
})

console.log('res2: ')
console.log(res2)

console.log('Users: ')
console.log(users)

const removedUser = removeUser(88)

console.log('Removed user: ')
console.log(removedUser)

console.log('Result: ')
console.log(users)




