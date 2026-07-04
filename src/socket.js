const socketAuth = require('./middleware/socketAuth')
const { getOneUser, updateUserStatus } = require('./data/users')

const initSocket = (io) => {
  io.use(socketAuth)

  io.on('connection', (socket) => {
    console.log(`✅ ${socket.user.name} connected!`)

    // USER COMES ONLINE
    updateUserStatus(socket.user.id, true)

    // tell EVERYONE ELSE this user is online
    socket.broadcast.emit('user online', {
      id: socket.user.id,
      name: socket.user.name
    })

    // START PRIVATE CHAT
    socket.on('start private chat', ({ recipientId }) => {
      // create unique room name (sorted so always same!)
      const roomId = [socket.user.id, recipientId]
        .sort()
        .join('-')

      // join the private room
      socket.join(roomId)

      console.log(`🚪 ${socket.user.name} joined room: ${roomId}`)

      // confirm room joined
      socket.emit('room joined', { roomId, recipientId })
    })

    // SEND PRIVATE MESSAGE
    socket.on('private message', ({ recipientId, text }) => {
      // recreate the room name
      const roomId = [socket.user.id, recipientId]
        .sort()
        .join('-')

      const message = {
        sender: socket.user.name,
        senderId: socket.user.id,
        text,
        time: new Date().toLocaleTimeString(),
        roomId
      }

      console.log(`💬 [${roomId}] ${socket.user.name}: ${text}`)

      // send ONLY to people in this private room!
      io.to(roomId).emit('private message', message)
    })

    // TYPING INDICATOR
    socket.on('typing', ({ recipientId }) => {
      const roomId = [socket.user.id, recipientId]
        .sort()
        .join('-')

      // tell EVERYONE in room EXCEPT sender
      socket.to(roomId).emit('typing', {
        name: socket.user.name
      })
    })

    socket.on('stop typing', ({ recipientId }) => {
      const roomId = [socket.user.id, recipientId]
        .sort()
        .join('-')

      socket.to(roomId).emit('stop typing')
    })

    // DISCONNECT
    socket.on('disconnect', () => {
      console.log(`❌ ${socket.user.name} disconnected!`)

      updateUserStatus(socket.user.id, false)

      // tell EVERYONE this user went offline
      socket.broadcast.emit('user offline', {
        id: socket.user.id,
        name: socket.user.name
      })
    })
  })
}

module.exports = initSocket