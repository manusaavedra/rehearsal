const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const http = require('http')
const socketIO = require('socket.io')

app.prepare().then(async () => {
    const server = express()
    const httpServer = http.createServer(server)
    const io = socketIO(httpServer)
    let users = []

    const addUser = (user) => {
        users.push(user)
    }

    const removeUser = (id) => {
        users = users.filter((user) => user.id !== id)
    }

    io.on('connection', (socket) => {
        console.log('Un cliente se ha conectado', socket.id)

        addUser({
            id: socket.id,
            ...socket.handshake.auth
        })

        io.emit('users', users)
        socket.emit('users', users)

        socket.on('setlist', (data) => {
            console.log('Recieved from API ::', data)
            io.emit('setlist', data);
        })

        socket.on('disconnect', () => {
            removeUser(socket.id)
            io.emit('users', users)
            console.log('Cliente desconectado', socket.id)
        })
    })

    server.all('*', (req, res) => {
        return handle(req, res)
    })

    const PORT = process.env.PORT || 3000
    httpServer.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})
