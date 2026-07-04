require('dotenv').config()
const http = require('http')
const {Server} = require('socket.io')
const app = require('./src/app')
const initSocket = require('./src/socket')


const server = http.createServer(app);

const io = new Server(server);

initSocket(io);

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`server running command on: http://localhost:${PORT}`)
})