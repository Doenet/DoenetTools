/*jshint esversion: 8 */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { atomFamily, useRecoilState } from 'recoil';
import { io } from 'socket.io-client';
import Tool from '@Tool';
import { v4 as uuidV4 } from 'uuid';

const ChatContainer = styled.div`
  border: solid var(--canvastext) 1px;
`;

const ChatForm = styled.form``;

const ChatInput = styled.input``;

const ChatSend = styled.button`
  border: none;
  background: var(--canvastext);
  color: var(--canvas);
`;

const MessageLogContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

const MessageElement = styled.div`
  border: 1px solid var(--canvastext);
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
  background: var(--canvastext);
  color: var(--canvas);
`;

const NameLabel = styled.label``;

function ChatMessage(props) {
  return (
    <MessageElement>
      <MessageName>{props.screenName}:</MessageName>
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
  const [driveSocket, setDriveSocket] = useState();
  const [docName, setDocName] = useState('one');
  const [currentTransaction, setCurrentTransaction] = useState('');

  useEffect(() => {
    let chatSocket = io('localhost:81/chat', {
      withCredentials: true,
    });
    chatSocket.on('connect', () => {
      console.log('socket', chatSocket.id, 'connected');
      setSocket(chatSocket);
    });
    chatSocket.on('connect_error', (e) => {
      console.log('socket connection error:', e);
    });

    chatSocket.on('chat message', (message) => {
      setCL((prev) => [...prev, message]);
      let log = document.getElementById('messageLogContainer');
      log.scrollTop = log.scrollHeight;
    });

    chatSocket.on('disconnect', () => {
      console.log('socket disconnected');
    });

    // let driveSocket = io('localhost:81/drive', {
    //   withCredentials: true,
    // });

    // driveSocket.on('connect', () => {
    //   console.log('drivesocket', driveSocket.id, 'connected');
    // });

    // driveSocket.on('file_renamed', (data) => {
    //   console.log('drivesocket file_rename received');
    //   setCurrentTransaction((currentId) => {
    //     if (currentId !== data.transactionId) {
    //       setDocName(data.name);
    //       return data.transactionId;
    //     }
    //     return currentId;
    //   });
    // });

    return () => {
      chatSocket.disconnect();
      // driveSocket.disconnect();
    };
  }, []);

  let messages = chatLog.map((val, i) => (
    <ChatMessage
      key={`doenet-chat-message-${i}-${val.messageId}`}
      messageId={val.messageId}
      screenName={val.screenName}
    >
      {val.message}
    </ChatMessage>
  ));
  return (
    <Tool>
      <headerPanel>document name: {docName}</headerPanel>

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
                {
                  message: messageEl.value,
                  messageId: new Date(),
                  room: `chat:${room}`,
                },
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
            socket.emit('leaveRoom', `chat:${room}`);
            socket.emit('joinRoom', `chat:${roomEl.value}`, (resp) => {
              console.log(resp);
            });
            setRoom(roomEl.value);
          }}
        >
          <RoomInput type="number" id="roomInput" defaultValue={room} />
          <RoomJoin type="submit">Join Room</RoomJoin>
        </RoomForm>
      </menuPanel>
      <supportPanel>
        <input type="text" id="newName" defaultValue="two" />
        <button
          onClick={() => {
            let nameEl = document.getElementById('newName');
            let name = nameEl.value;
            let transactionId = uuidV4();
            driveSocket.emit(
              'rename_item',
              {
                name,
                transactionId,
                respCode: document.getElementById('respCode').value,
              },
              (resp, transactionId) => {
                if (resp === 200) {
                  console.log('success!');
                  setDocName(name);
                  setCurrentTransaction(transactionId);
                } else if (resp === 403) {
                  console.log('access deined');
                  nameEl.value = docName;
                } else {
                  console.log('error:', resp);
                  nameEl.value = docName;
                }
              },
            );
          }}
        >
          rename_item
        </button>
        <select name="respCode" id="respCode">
          <option value={200}>OK</option>
          <option value={403}>Forbidden</option>
          <option value={404}>Sever Failed</option>
        </select>
      </supportPanel>
    </Tool>
  );
}
