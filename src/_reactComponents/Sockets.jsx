import { nanoid } from 'nanoid';
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
import {
  folderDictionary,
  getLexicographicOrder,
  sortOptions,
} from './Drive/Drive';

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
  const socket = useRecoilValue(sockets(namespace));

  const addItem = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({
        driveIdFolderId,
        label,
        itemType,
        selectedItemId = null,
        url = null,
      }) => {
        // Item creation
        const dt = new Date();
        const creationDate = formatDate(dt);
        const itemId = nanoid();
        const doenetId = nanoid();
        const newItem = {
          assignmentId: null,
          doenetId,
          contentId: null,
          creationDate,
          isPublished: '0',
          itemId,
          itemType: itemType,
          label: label,
          parentFolderId: driveIdFolderId.folderId,
          url: url,
          urlDescription: null,
          urlId: null,
          sortOrder: '',
        };

        const fInfo = await snapshot.getPromise(
          folderDictionary(driveIdFolderId),
        );
        let newObj = JSON.parse(JSON.stringify(fInfo));
        let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
        let index = newDefaultOrder.indexOf(selectedItemId);
        const newOrder = getLexicographicOrder({
          index,
          nodeObjs: newObj.contentsDictionary,
          defaultFolderChildrenIds: newDefaultOrder,
        });
        newItem.sortOrder = newOrder;
        newDefaultOrder.splice(index + 1, 0, itemId);
        newObj.contentIds[sortOptions.DEFAULT] = newDefaultOrder;
        newObj.contentsDictionary[itemId] = newItem;

        const versionId = nanoid();
        const payload = {
          driveId: driveIdFolderId.driveId,
          parentFolderId: driveIdFolderId.folderId,
          itemId,
          doenetId,
          versionId,
          label: label,
          type: itemType,
          sortOrder: newItem.sortOrder,
        };
        console.log(driveIdFolderId, {
          driveId: payload.driveId,
          folderId: payload.parentFolderId,
        });
        socket.emit('add_doenetML', payload, newObj, (respData) => {
          if (respData.success) {
            acceptNewItem(payload, newObj);
          } else {
            onAddItemError({ errorMessage: respData });
          }
        });
      },
  );

  const onAddItemError = ({ errorMessage = null }) => {
    addToast(`Add item error: ${errorMessage}`, ToastType.ERROR);
  };
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

  useEffect(() => {
    console.log('>>>configure', namespace);
    bindings[namespace].map((bind) => {
      socket.on(bind.eventName, bind.callback);
    });
  }, [bindings, socket, namespace]);

  return { addItem, onAddItemError };
}

const formatDate = (dt) => {
  const formattedDate = `${dt.getFullYear().toString().padStart(2, '0')}-${(
    dt.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt
    .getHours()
    .toString()
    .padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;

  return formattedDate;
};
