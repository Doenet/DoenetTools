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
  globalSelectedNodesAtom,
  selectedDriveItemsAtom,
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

/**
 * Hook access to realtime sockets, supports conection to drive and chat
 *
 * @param {string} nsp namespace connect to
 */
export default function useSockets(nsp) {
  const [addToast, ToastType] = useToast();
  const [namespace] = useState(nsp);
  const socket = useRecoilValue(sockets(namespace));
  // const { addItem, onAddItemError, deleteItem, onDeleteItemError} = useDriveBindings()

  /**
   * create and add a new folder or doenetML
   *
   */
  const addItem = useRecoilCallback(
    ({ snapshot }) =>
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

  const acceptDelete = useRecoilCallback(
    ({ set }) =>
      (payload, newFInfo, label) => {
        set(
          folderDictionary({
            driveId: payload.driveId,
            folderId: payload.parentFolderId,
          }),
          newFInfo,
        );
        addToast(`Deleted item '${label}'`, ToastType.SUCCESS);
      },
  );

  const deleteItem = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ driveIdFolderId, driveInstanceId = null, itemId, label }) => {
        const fInfo = await snapshot.getPromise(
          folderDictionary(driveIdFolderId),
        );
        const globalSelectedNodes = await snapshot.getPromise(
          globalSelectedNodesAtom,
        );
        const item = {
          driveId: driveIdFolderId.driveId,
          driveInstanceId: driveInstanceId,
          itemId: itemId,
        };
        const selectedDriveItems = await snapshot.getPromise(
          selectedDriveItemsAtom(item),
        );

        // Remove from selection
        if (selectedDriveItems) {
          set(selectedDriveItemsAtom(item), false);
          let newGlobalItems = [];
          for (let gItem of globalSelectedNodes) {
            if (gItem.itemId !== itemId) {
              newGlobalItems.push(gItem);
            }
          }
          set(globalSelectedNodesAtom, newGlobalItems);
        }

        // Remove from folder
        let newFInfo = { ...fInfo };
        newFInfo['contentsDictionary'] = { ...fInfo.contentsDictionary };
        delete newFInfo['contentsDictionary'][itemId];
        newFInfo.folderInfo = { ...fInfo.folderInfo };
        newFInfo.contentIds = {};
        newFInfo.contentIds[sortOptions.DEFAULT] = [
          ...fInfo.contentIds[sortOptions.DEFAULT],
        ];
        const index = newFInfo.contentIds[sortOptions.DEFAULT].indexOf(itemId);
        newFInfo.contentIds[sortOptions.DEFAULT].splice(index, 1);

        // Remove from database
        const pdata = {
          driveId: driveIdFolderId.driveId,
          parentFolderId: driveIdFolderId.folderId,
          itemId: itemId,
        };
        socket.emit('delete_doenetML', pdata, newFInfo, (respData) => {
          if (respData.success) {
            acceptDelete(pdata, newFInfo, label);
          } else {
            onDeleteItemError({ errorMessage: respData.message });
          }
        });
      },
  );

  const onDeleteItemError = ({ errorMessage = null }) => {
    addToast(`Delete item error: ${errorMessage}`, ToastType.ERROR);
  };

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
      {
        eventName: 'remote_add_folder',
        callback: acceptNewItem,
      },
      {
        eventName: 'remote_delete_doenetML',
        callback: acceptDelete,
      },
    ],
  });

  useEffect(() => {
    console.log('>>>configure', namespace);
    bindings[namespace].map((bind) => {
      socket.on(bind.eventName, bind.callback);
    });
    return () => {
      console.log('>>>disconnect', namespace);
      socket.disconnect();
    };
  }, [bindings, socket, namespace]);

  return { addItem, onAddItemError, deleteItem, onDeleteItemError };
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
