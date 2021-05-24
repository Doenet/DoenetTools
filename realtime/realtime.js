(async () => {
  const httpServer = require('http').createServer();
  const io = require('socket.io')(httpServer, {
    cors: {
      origin: 'http://localhost',
      methods: ['GET', 'POST'],
    },
  });

  const activeUsers = new Set();

  io.on('connection', (socket) => {
    console.log('connecting', socket.id);
    socket.emit(
      'message',
      '{"userId": "Server", "messageId": -1, "message": "Socket.io connection Successful! Try joining a room!"}',
    );

    socket.on('new user', (data) => {
      socket.userId = data;
      activeUsers.add(data);
      io.emit('new user', [...activeUsers]);
    });

    socket.on('chat message', function (data) {
      console.log('>>>message recived:', data);
      io.emit('chat message', data);
    });

    socket.on('typing', function (data) {
      socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', () => {
      activeUsers.delete(socket.userId);
      io.emit('user disconnected', socket.userId);
    });
  });

  httpServer.listen(81);
})();
