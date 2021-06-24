import React, { useEffect, useState } from 'react';
import {
  atom,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilValue,
  useRecoilCallback,
} from 'recoil';
import { Manager } from 'socket.io-client';
import { useToast } from '../Tools/_framework/Toast';
import { folderDictionary, sortOptions } from './Drive/Drive';

const socketManger = atom({
  key: 'socketManger',
  default: selector({
    key: 'socketManger/Default',
    get: () => {
      return new Manager('http://localhost:81', {
        withCredentials: true,
      });
    },
    dangerouslyAllowMutability: true,
  }),
  dangerouslyAllowMutability: true,
});

const sockets = atomFamily({
  key: 'socketStore',
  default: selectorFamily({
    key: 'socketStore/Default',
    get:
      (nsp) =>
      ({ get }) => {
        const manager = get(socketManger);
        const socket = manager.socket(`/${nsp}`);
        return socket;
      },
    dangerouslyAllowMutability: true,
  }),
  dangerouslyAllowMutability: true,
});

export default function useSockets(nsp) {
  const [addToast, ToastType] = useToast();
  const [namespace] = useState(nsp);
  const acceptNewItem = useRecoilCallback(({ set }) => (payload, newItem) => {
    // Insert item info into destination folder
    set(
      folderDictionary({
        driveId: payload.driveId,
        folderId: payload.parentFolderId,
      }),
      newItem,
    );
    addToast(`Add new item 'Untitled'`, ToastType.SUCCESS);

    // Update folderDictionary when new item is of type Folder
    if (payload.type === 'Folder') {
      set(
        folderDictionary({
          driveId: payload.driveId,
          folderId: payload.parentFolderId,
        }),
        {
          folderInfo: newItem,
          contentsDictionary: {},
          contentIds: { [sortOptions.DEFAULT]: [] },
        },
      );
    }
  });
  const [bindings] = useState({
    drive: [
      {
        eventName: 'connection',
        callback: () => {
          console.log('Socket', socket.id, 'connected');
        },
      },
      {
        eventName: 'remote_add_doenetML',
        callback: acceptNewItem,
      },
    ],
  });
  const socket = useRecoilValue(sockets(namespace));

  useEffect(() => {
    console.log('>>>configure', namespace);
    bindings[namespace].map((bind) => {
      socket.on(bind.eventName, bind.callback);
    });
  }, [bindings, socket, namespace]);

  return { socket, acceptNewItem };
}
