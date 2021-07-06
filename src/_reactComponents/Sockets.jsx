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
  folderCacheDirtyAtom,
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
  const dragShadowId = 'dragShadow';
  const { createItem, onAddItemError } = useAddItem();
  const { removeItem, onDeleteItemError } = useDeleteItem();
  // const { addItem, onAddItemError, deleteItem, onDeleteItemError} = useDriveBindings()

  const acceptNewItem = useRecoilCallback(
    ({ set }) =>
      (payload, newItem) => {
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
      },
    [addToast, ToastType.SUCCESS],
  );

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

  const acceptMove = useRecoilCallback(
    ({ set }) =>
      (payload, newDestinationFolderObj, editedCache) => {
        // Clear global selection
        set(globalSelectedNodesAtom, []);

        // Add all to destination
        set(
          folderDictionary({
            driveId: payload.destinationDriveId,
            folderId: payload.destinationItemId,
          }),
          newDestinationFolderObj,
        );

        // Remove from sources
        for (let driveId of Object.keys(editedCache)) {
          for (let parentFolderId of Object.keys(editedCache[driveId])) {
            set(
              folderDictionary({
                driveId: driveId,
                folderId: parentFolderId,
              }),
              editedCache[driveId][parentFolderId],
            );
            // Mark modified folders as dirty
            set(
              folderCacheDirtyAtom({
                driveId: driveId,
                folderId: parentFolderId,
              }),
              true,
            );
          }
        }

        // Mark current folder as dirty
        set(
          folderCacheDirtyAtom({
            driveId: payload.destinationDriveId,
            folderId: payload.destinationItemId,
          }),
          true,
        );
      },
  );

  const addItem = () => {
    const [payload, newItem] = createItem();
    socket.emit('add_doenetML', payload, newItem, (respData) => {
      if (respData.success) {
        acceptNewItem(payload, newItem);
      } else {
        onAddItemError({ errorMessage: respData });
      }
    });
  };

  const deleteItem = () => {
    const [payload, newFInfo, label] = removeItem();
    socket.emit('delete_doenetML', payload, newFInfo, (respData) => {
      if (respData.success) {
        acceptDelete(payload, newFInfo, label);
      } else {
        onDeleteItemError({ errorMessage: respData.message });
      }
    });
  };

  const moveItems = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ targetDriveId, targetFolderId, index }) => {
        const globalSelectedNodes = await snapshot.getPromise(
          globalSelectedNodesAtom,
        );

        // Interrupt move action if nothing selected
        if (globalSelectedNodes.length === 0) {
          throw 'No items selected';
        }

        // Interrupt move action if dragging folder to itself
        for (let gItem of globalSelectedNodes) {
          if (gItem.itemId === targetFolderId) {
            throw 'Cannot move folder into itself';
          }
        }

        // if (canMove){
        // Add to destination at index
        let destinationFolderObj = await snapshot.getPromise(
          folderDictionary({
            driveId: targetDriveId,
            folderId: targetFolderId,
          }),
        );
        let newDestinationFolderObj = JSON.parse(
          JSON.stringify(destinationFolderObj),
        );
        let editedCache = {};
        let driveIdChanged = [];
        const insertIndex = index ?? 0;
        let newSortOrder = '';

        for (let gItem of globalSelectedNodes) {
          // Deselect Item
          let selectedItem = {
            driveId: gItem.driveId,
            driveInstanceId: gItem.driveInstanceId,
            itemId: gItem.itemId,
          };
          set(selectedDriveItemsAtom(selectedItem), false);

          // Get parentInfo from edited cache or derive from oldSource
          const oldSourceFInfo = await snapshot.getPromise(
            folderDictionary({
              driveId: gItem.driveId,
              folderId: gItem.parentFolderId,
            }),
          );
          let newSourceFInfo =
            editedCache[gItem.driveId]?.[gItem.parentFolderId];
          if (!newSourceFInfo)
            newSourceFInfo = JSON.parse(JSON.stringify(oldSourceFInfo));

          // Handle moving item out of folder
          if (gItem.parentFolderId !== targetFolderId) {
            // Remove item from original parent contentIds
            let index = newSourceFInfo['contentIds']['defaultOrder'].indexOf(
              gItem.itemId,
            );
            newSourceFInfo['contentIds']['defaultOrder'].splice(index, 1);

            // Add item to destination dictionary
            newDestinationFolderObj['contentsDictionary'][gItem.itemId] = {
              ...newSourceFInfo['contentsDictionary'][gItem.itemId],
            };

            // Remove item from original dictionary
            delete newSourceFInfo['contentsDictionary'][gItem.itemId];

            // Ensure item removed from cached parent and added to edited cache
            if (!editedCache[gItem.driveId]) editedCache[gItem.driveId] = {};
            editedCache[gItem.driveId][gItem.parentFolderId] = newSourceFInfo;
          } else {
            // Ensure item not duplicated in destination contentIds
            newDestinationFolderObj['contentIds']['defaultOrder'] =
              newDestinationFolderObj['contentIds']['defaultOrder'].filter(
                (itemId) => itemId !== gItem.itemId,
              );
          }

          // Generate and update sortOrder
          const cleanDefaultOrder = newDestinationFolderObj['contentIds'][
            'defaultOrder'
          ].filter((itemId) => itemId !== dragShadowId);
          newSortOrder = getLexicographicOrder({
            index: insertIndex,
            nodeObjs: newDestinationFolderObj.contentsDictionary,
            defaultFolderChildrenIds: cleanDefaultOrder,
          });
          newDestinationFolderObj['contentsDictionary'][
            gItem.itemId
          ].sortOrder = newSortOrder;
          newDestinationFolderObj['contentsDictionary'][
            gItem.itemId
          ].parentFolderId = targetFolderId;

          // Insert item into contentIds of destination
          newDestinationFolderObj['contentIds']['defaultOrder'].splice(
            insertIndex,
            0,
            gItem.itemId,
          );

          // If moved item is a folder, update folder info
          if (
            oldSourceFInfo['contentsDictionary'][gItem.itemId].itemType ===
            'Folder'
          ) {
            // Retrieval from folderDictionary necessary when moving to different drive
            const gItemFolderInfoObj = await snapshot.getPromise(
              folderDictionary({
                driveId: gItem.driveId,
                folderId: gItem.itemId,
              }),
            );
            set(
              folderDictionary({
                driveId: targetDriveId,
                folderId: gItem.itemId,
              }),
              () => {
                let newFolderInfo = { ...gItemFolderInfoObj };
                newFolderInfo.folderInfo = { ...gItemFolderInfoObj.folderInfo };
                newFolderInfo.folderInfo.parentFolderId = targetFolderId;
                return newFolderInfo;
              },
            );
          }

          // If moved between drives, handle update driveId
          if (gItem.driveId !== targetDriveId) {
            driveIdChanged.push(gItem.itemId);

            // Update driveId of all children in the subtree
            if (
              oldSourceFInfo['contentsDictionary'][gItem.itemId].itemType ===
              'Folder'
            ) {
              let gItemChildIds = [];
              let queue = [gItem.itemId];

              // BFS tree-walk to iterate through all child nodes
              while (queue.length) {
                let size = queue.length;
                for (let i = 0; i < size; i++) {
                  let currentNodeId = queue.shift();
                  const folderInfoObj = await snapshot.getPromise(
                    folderDictionary({
                      driveId: gItem.driveId,
                      folderId: currentNodeId,
                    }),
                  );
                  gItemChildIds.push(currentNodeId);
                  for (let childId of folderInfoObj?.contentIds?.[
                    sortOptions.DEFAULT
                  ]) {
                    if (
                      folderInfoObj?.contentsDictionary[childId].itemType ===
                      'Folder'
                    ) {
                      // migrate child folderInfo into destination driveId
                      const childFolderInfoObj = await snapshot.getPromise(
                        folderDictionary({
                          driveId: gItem.driveId,
                          folderId: childId,
                        }),
                      );
                      set(
                        folderDictionary({
                          driveId: targetDriveId,
                          folderId: childId,
                        }),
                        childFolderInfoObj,
                      );
                      queue.push(childId);
                    } else {
                      gItemChildIds.push(childId);
                    }
                  }
                }
              }

              driveIdChanged = [...driveIdChanged, ...gItemChildIds];
            }
          }
        }

        let selectedItemIds = [];
        for (let item of globalSelectedNodes) {
          selectedItemIds.push(item.itemId);
        }

        const payload = {
          sourceDriveId: globalSelectedNodes[0].driveId,
          selectedItemIds,
          selectedItemChildrenIds: driveIdChanged,
          destinationItemId: targetFolderId,
          destinationParentFolderId:
            destinationFolderObj.folderInfo.parentFolderId,
          destinationDriveId: targetDriveId,
          newSortOrder,
        };

        socket.emit(
          'update_file_location',
          (payload,
          newDestinationFolderObj,
          editedCache,
          (respData) => {
            if (respData.success) {
              acceptMove(payload, newDestinationFolderObj, editedCache);
            }
          }),
        );
      },
  );

  const onMoveItemsError = ({ errorMessage = null }) => {
    addToast(`Move item(s) error: ${errorMessage}`, ToastType.ERROR);
  };

  const renameItem = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ driveIdFolderId, itemId, itemType, newLabel }) => {
        const fInfo = await snapshot.getPromise(
          folderDictionary(driveIdFolderId),
        );

        // Rename in folder
        let newFInfo = { ...fInfo };
        newFInfo['contentsDictionary'] = { ...fInfo.contentsDictionary };
        newFInfo['contentsDictionary'][itemId] = {
          ...fInfo.contentsDictionary[itemId],
        };
        newFInfo['contentsDictionary'][itemId].label = newLabel;

        // Rename in database
        const rndata = {
          instruction: 'rename',
          driveId: driveIdFolderId.driveId,
          itemId: itemId,
          label: newLabel,
        };
        socket.emit('update_file_name', rndata, (respData) => {
          if (respData.success) {
            set(folderDictionary(driveIdFolderId), newFInfo);
            // If a folder, update the label in the child folder
            if (itemType === 'Folder') {
              set(
                folderDictionary({
                  driveId: driveIdFolderId.driveId,
                  folderId: itemId,
                }),
                (old) => {
                  let newFolderInfo = { ...old };
                  newFolderInfo.folderInfo = { ...old.folderInfo };
                  newFolderInfo.folderInfo.label = newLabel;
                  return newFolderInfo;
                },
              );
            }
          }
        });
      },
  );

  const onRenameItemError = ({ errorMessage = null }) => {
    addToast(`Rename item error: ${errorMessage}`, ToastType.ERROR);
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
      {
        eventName: 'remote_update_file_locaiton',
        callback: acceptMove,
      },
    ],
  });

  useEffect(() => {
    console.log('>>>configure', namespace);
    bindings[namespace].map((bind) => {
      if (!socket.hasListeners(bind.eventName)) {
        socket.on(bind.eventName, bind.callback);
      }
    });
    return () => {
      console.log('>>>disconnect', namespace);
      socket.disconnect();
    };
  }, [bindings, socket, namespace]);

  return {
    addItem,
    onAddItemError,
    deleteItem,
    onDeleteItemError,
    moveItems,
    onMoveItemsError,
    renameItem,
    onRenameItemError,
  };
}

const useAddItem = () => {
  const [addToast, ToastType] = useToast();
  /**
   * create and add a new folder or doenetML
   *
   */
  const createItem = useRecoilCallback(
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
        return [payload, newObj];
      },
    [],
  );

  const onAddItemError = ({ errorMessage = null }) => {
    addToast(`Add item error: ${errorMessage}`, ToastType.ERROR);
  };
  return { createItem, onAddItemError };
};

const useDeleteItem = () => {
  const [addToast, ToastType] = useToast();
  const removeItem = useRecoilCallback(
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
        const payload = {
          driveId: driveIdFolderId.driveId,
          parentFolderId: driveIdFolderId.folderId,
          itemId: itemId,
        };
        return [payload, newFInfo, label];
      },
    [],
  );

  const onDeleteItemError = ({ errorMessage = null }) => {
    addToast(`Delete item error: ${errorMessage}`, ToastType.ERROR);
  };

  return { removeItem, onDeleteItemError };
};

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
