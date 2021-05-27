(async () => {
  const httpServer = require('http').createServer();
  const io = require('socket.io')(httpServer, {
    cors: {
      origin: [
        'http://localhost',
        'http://localhost:81',
        'http://198.199.122.67',
        'http://198.199.122.67:81',
      ],
      methods: ['GET', 'POST'],
      allowedHeaders: ['access'],
      credentials: true,
    },
  });
  const { default: axios } = require('axios');

  io.use((socket, next) => {
    //TODO: auth against central database instead of local
    socket.data.profile = { screenName: 'remote-test-anon' };
    next();
    // axios
    //   .get('http://localhost/api/loadProfile.php', {
    //     headers: socket.handshake.headers,
    //     params: {},
    //   })
    //   .then((resp) => {
    //     if (resp.data.success === '1') {
    //       if (resp.data.profile.signedIn === '1') {
    //         socket.data.profile = resp.data.profile;
    //         next();
    //       } else {
    //         next(new Error('Please sign in'));
    //       }
    //     } else {
    //       next(new Error('PHP sever error'));
    //     }
    //   })
    //   .catch((error) => {
    //     next(new Error(`Axios request error: ${error}`));
    //   });
  });

  io.on('connection', (socket) => {
    console.log('connecting', socket.id);
    socket.emit('chat message', {
      messageId: -1,
      message: 'Socket.io connection Successful! Try joining a room!',
      screenName: 'Server',
    });

    socket.on('joinRoom', (room) => {
      socket.join(room);
      io.to(room).emit('chat message', {
        messageId: -1,
        message: `${socket.data.profile.screenName} joined room ${room}`,
        screenName: 'Sever',
      });
    });

    socket.on('leaveRoom', (room) => {
      socket.leave(room);
      io.to(room).emit('chat message', {
        messageId: -1,
        message: `${socket.data.profile.screenName} left the room`,
        screenName: 'Sever',
      });
    });

    socket.on('chat message', (data) => {
      data.screenName = socket.data.profile.screenName;
      io.to(data.room).emit('chat message', data);
    });

    socket.on('typing', (data) => {
      data.screenName = socket.data.profile.screenName;
      socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', () => {
      io.emit('user disconnected', socket.userId);
    });
  });
  console.log('sever ready!');
  httpServer.listen(81);
})();
