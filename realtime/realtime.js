(async () => {
  const httpServer = require('http').createServer();
  const io = require('socket.io')(httpServer, {
    cors: {
      origin: [
        'http://localhost',
        'https://doenet.org',
        'https://dev.doenet.org',
      ],
      methods: ['GET', 'POST'],
      allowedHeaders: ['access'],
      credentials: true,
    },
  });
  const driveSpace = io.of('/drive');
  const chatSpace = io.of('/chat');
  const { default: axios } = require('axios');

  chatSpace.use((socket, next) => {
    axios
      .get('https://doenet.org/api/loadProfile.php', {
        headers: socket.handshake.headers,
        params: {},
      })
      .then((resp) => {
        if (resp.data.success === '1') {
          if (resp.data.profile.signedIn === '1') {
            socket.data.profile = resp.data.profile;
            console.log('auth: ', socket.data.profile.screenName);
            next();
          } else {
            next(new Error('Please sign in'));
          }
        } else {
          next(new Error('PHP sever error'));
        }
      })
      .catch((error) => {
        next(new Error(`Axios request error: ${error}`));
      });
  });

  chatSpace.on('connection', (socket) => {
    console.log('connecting', socket.id);
    io.to(socket.id).emit('chat message', {
      messageId: -1,
      message: 'Socket.io connection Successful! Try joining a room!',
      screenName: 'Server',
    });

    socket.on('joinRoom', (room, cb) => {
      socket.join(room);
      chatSpace.to(room).emit('chat message', {
        messageId: -1,
        message: `${socket.data.profile.screenName} joined room ${room}`,
        screenName: 'Sever',
      });
      cb(`joined ${room}`);
    });

    socket.on('leaveRoom', (room) => {
      socket.leave(room);
      chatSpace.to(room).emit('chat message', {
        messageId: -1,
        message: `${socket.data.profile.screenName} left the room`,
        screenName: 'Sever',
      });
    });

    socket.on('chat message', (data) => {
      data.screenName = socket.data.profile.screenName;
      chatSpace.to(data.room).emit('chat message', data);
    });

    socket.on('typing', (data) => {
      data.screenName = socket.data.profile.screenName;
      socket.broadcast.emit('typing', data);
    });

    socket.on('disconnect', () => {
      chatSpace.emit('user disconnected', socket.userId);
    });
  });

  driveSpace.on('connection', (socket) => {
    socket.on('rename_item', (data, cb) => {
      console.log('>>>Rename from', socket.id, 'to', data.name);
      cb('resp code');
      io.to('drive').in(data.driveId).emit('rename_item', data);
    });
  });
  console.log('sever ready!');
  httpServer.listen(81);
})();
