(async () => {
  const httpServer = require('http').createServer();
  const io = require('socket.io')(httpServer, {
    cors: {
      origin: [
        'http://localhost',
        'http://localhost/chat',
        'https://doenet.org',
        'https://dev.doenet.org',
        'https://chat.rt.doenet.org',
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
    //TODO: auth against central database instead of local
    socket.data.profile = { screenName: 'remote-test-anon' };
    next();
    // axios
    //   .get('https://doenet.org/api/loadProfile.php', {
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

  chatSpace.on('connection', (socket) => {
    console.log('connecting', socket.id);
    chatSpace.to(socket.id).emit('chat message', {
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
      // axios.get('http://apache/api/updateItem.php', {
      //   headers: socket.request.headers,
      //   params: { driveId: '', itemId: '', label: '', instruction: 'rename' },
      // });
      // axios
      //   .get('http://apache/api/loadProfile.php', {
      //     headers: socket.handshake.headers,
      //     params: {},
      //   })
      //   .then((resp) => {
      //     console.log('request done for', data.name, resp.status);
      if (data.respCode === '200') {
        cb(200, data.transctionId);
        socket.broadcast.emit('file_renamed', data);
      } else if (data.respCode === '403') {
        cb(403);
      } else {
        cb('error');
      }
      //   })
      //   .catch((error) => {
      //     cb(new Error(`Axios request error: ${error}`));
      //   });
      console.log('func done for', data.name);
      // driveSpace.to(data.driveId).emit('rename_item', data);
    });
  });
  console.log('sever ready!');
  httpServer.listen(81);
})();
