/*jshint esversion: 8 */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { io } from 'socket.io-client';
import Tool from '@Tool';

const ChatContainer = styled.div`
  border: solid black 1px;
`;

const ChatForm = styled.form``;

const ChatInput = styled.input``;

const ChatSend = styled.button`
  border: none;
  background: black;
  color: white;
`;

const MessageLogContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

const MessageElement = styled.div`
  border: 1px solid black;
  margin: 1em 0;
`;

const MessageName = styled.div`
  font-weight: bold;
`;
const MessageContent = styled.div``;

const RoomForm = styled.form``;

const RoomInput = styled.input``;

const RoomJoin = styled.button`
  border: none;
  background: black;
  color: white;
`;

const NameLabel = styled.label``;

function ChatMessage(props) {
  return (
    <MessageElement>
      <MessageName>{props.userId}:</MessageName>
      <MessageContent>{props.children}</MessageContent>
    </MessageElement>
  );
}

export default function Chat() {
  const [chatLog, setCL] = useState([]);
  const [socket, setSocket] = useState();
  const [room, setRoom] = useState(12);
  const [screenName] = useState(
    JSON.parse(localStorage.getItem('Profile')).screenName,
  );

  useEffect(() => {
    let socket = io('localhost:81', { withCredentials: true });
    socket.on('connect', () => {
      console.log('socket', socket.id, 'connected');
      socket.emit('joinRoom', room);
      setSocket(socket);
    });
    socket.on('connect_error', (e) => {
      console.log('socket connection error:', e);
    });

    socket.on('chat message', (message, userId) => {
      let newMessage = JSON.parse(message);
      newMessage.userId = userId;
      setCL((prev) => [...prev, newMessage]);
      let log = document.getElementById('messageLogContainer');
      log.scrollTop = log.scrollHeight;
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected');
    });

    return () => socket.disconnect();
  }, []);

  let messages = chatLog.map((val, i) => (
    <ChatMessage
      key={`doenet-chat-message-${i}-${val.messageId}`}
      messageId={val.messageId}
      userId={val.userId}
    >
      {val.message}
    </ChatMessage>
  ));
  return (
    <Tool>
      <headerPanel />
      <mainPanel>
        <ChatContainer>
          <MessageLogContainer id="messageLogContainer">
            {messages}
          </MessageLogContainer>
          <ChatForm
            onSubmit={(e) => {
              e.preventDefault();
              let messageEl = document.getElementById('chatInput');
              socket.emit(
                'chat message',
                JSON.stringify({
                  message: messageEl.value,
                  messageId: new Date(),
                  room: room,
                }),
                //   new RTChatMessage(
                //     'a user, security TBI',
                //     'user',
                //     new Date(),
                //     messageEl.value,
                //     new Date(),
                //     room,
                //   ).toString(),
              );
              messageEl.value = '';
            }}
          >
            <ChatInput type="text" autocomplete="hidden" id="chatInput" />
            <ChatSend type="submit">Send Message</ChatSend>
          </ChatForm>
        </ChatContainer>
      </mainPanel>
      <menuPanel title="options" isInitOpen>
        <NameLabel>Messaging as: {screenName}</NameLabel>
        <RoomForm
          onSubmit={(e) => {
            e.preventDefault();
            let roomEl = document.getElementById('roomInput');
            socket.emit('leaveRoom', 'chat:' + room);
            socket.emit('joinRoom', 'chat:' + roomEl.value);
            setRoom(roomEl.value);
          }}
        >
          <RoomInput type="number" id="roomInput" defaultValue={room} />
          <RoomJoin type="submit">Join Room</RoomJoin>
        </RoomForm>
      </menuPanel>
    </Tool>
  );
}
