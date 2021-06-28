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
  const axios = require('axios').default;
  axios.defaults.baseURL = 'http://apache/api/';

  chatSpace.use((socket, next) => {
    axios
      .get('loadProfile.php', {
        headers: socket.handshake.headers,
      })
      .then((resp) => {
        if (resp.data.success === '1') {
          if (resp.data.profile.signedIn === '1') {
            socket.data.profile = resp.data.profile;
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
    console.log('connected', socket.id);
    socket.on('add_drive', ({ driveId, label, image, color }, cb) => {
      console.log('>>>recived add_drive');
    });

    socket.on(
      'add_folder',
      (
        {
          driveId,
          parentFolderId,
          itemId,
          doenetId,
          versionId,
          label,
          type,
          sortOrder,
        },
        cb,
      ) => {
        console.log('>>>recived add_folder');
      },
    );

    socket.on('add_doenetML', (payload, newItem, cb) => {
      axios
        .get('addItem.php', {
          params: payload,
          headers: socket.request.headers,
        })
        .then((resp) => {
          cb(resp.data);
          socket.broadcast.emit('remote_add_doenetML', payload, newItem);
        })
        .catch((err) => console.log('>>>ERROR:', err));
    });

    socket.on('add_user', ({ driveId, email, userId }, cb) => {
      console.log('>>>recived add_user');
    });

    socket.on('delete_doenetML', (payload, newInfo, cb) => {
      axios
        .get('deleteItem.php', {
          params: payload,
          headers: socket.request.headers,
        })
        .then((resp) => {
          console.log(resp);
          cb(resp.data);
          socket.broadcast.emit('remote_delete_doenetML', payload, newInfo);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  console.log('sever ready!');
  httpServer.listen(81);
})();
