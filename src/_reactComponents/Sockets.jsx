/**
 * External deps
 */
// import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { nanoid } from 'nanoid';
import {
  atom,
  selector,
  atomFamily,
  selectorFamily,
  // useRecoilValue,
  useRecoilCallback,
} from 'recoil';
import { Manager } from 'socket.io-client';
/**
 * Internal deps
 */
import { useToast, toastType } from '../Tools/_framework/Toast';
import {
  folderCacheDirtyAtom,
  folderDictionary,
  getLexicographicOrder,
  globalSelectedNodesAtom,
  selectedDriveItemsAtom,
  sortOptions,
} from './Drive/NewDrive';
import { DateToUTCDateString } from '../_utils/dateUtilityFunction';

/**
 * a stored manger to allow for multiplexed socket connections.
 * The dangerouslyAllowMutability flag must be set to stop dev mode
 * object freezing in recoil
 */
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

/**
 * keyed by namespace. Binding cannot be donw here until a set function is
 * allowed to exist (atom effects?). The dangerouslyAllowMutability
 * flag must be set to stop dev mode object freezing in recoil
 */
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

export const itemType = Object.freeze({
  FOLDER: 'Folder',
  DOENETML: 'DoenetML',
  URL: 'Url',
  COLLECTION: 'Collection',
});

/**
 * Hook to access realtime functions, supports drive and chat namespaces
 * @param {string} nsp - namespace to connect to
 * @returns {Object} {@link addItem}, {@link deleteItem}, {@link moveItems}, {@link renameItem}, and {@link copyItems} item functions
 */
export default function useSockets(nsp) {
  const addToast = useToast();

  // realtime upgrade
  // const [namespace] = useState(nsp);
  // const socket = useRecoilValue(sockets(namespace));
  const dragShadowId = 'dragShadow';
  const { acceptAddItem, acceptDeleteItem, acceptMoveItems, acceptRenameItem } =
    useAcceptBindings();

  /**
   * @typedef addOptions
   * @property {Object} driveIdFolderId - object containing the target drive and folder Ids
   * @property {string} driveIdFolderId.driveId
   * @property {string} driveIdFolderId.folderId
   * @property {string} type - type of item being added, one of DoenetML, Folder, or Url
   * @property {string} [label=Untitled] - display name of the new item
   * @property {string} [selectedItemId=null] the item to insert the new item after in the sort order
   * @property {string} [url=null] hyperlink for url type items
   */

  /**
   * create and add a new folder or doenetML
   * @param {addOptions} addOptions - configuration {@link itemOptions} for new Item
   */
  const addItem = useRecoilCallback(({ snapshot }) =>
    /**
     * Create a new item
     * @param {addOptions} param0 configuration for new Item
     */
    async ({ driveIdFolderId, type, label = 'Untitled', selectedItemId = null, url = null }) => {
      // Item creation
      const dt = new Date();
      const creationDate = DateToUTCDateString(dt); //TODO: get from sever
      const itemId = nanoid(); //TODO: remove
      const doenetId = nanoid(); //Id per file
      const versionId = nanoid(); //Id per named version / data collection site

      //generate sort order
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

      let payload = {
        driveId: driveIdFolderId.driveId,
        parentFolderId: driveIdFolderId.folderId,
        doenetId,
        itemId,
        versionId,
        type,
        label: label,
        sortOrder: newOrder,
        selectedItemId,
        creationDate,
        url,
      };

      if (type === 'DoenetML') {
        payload = {
          ...payload,
          assignedDate: null,
          attemptAggregation: 'm',
          dueDate: null,
          gradeCategory: '',
          individualize: true,
          isAssigned: '0',
          isPublished: '0',
          cid:
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          multipleAttempts: true, //TODO: is this ignored? should we delete it?
          numberOfAttemptsAllowed: '1',
          proctorMakesAvailable: false,
          showCorrectness: true,
          showFeedback: true,
          showHints: true,
          showSolution: true,
          showSolutionInGradebook: true,
          timeLimit: null,
          totalPointsOrPercent: '10',
          assignment_isPublished: '0',
        };
      }

      if (type === itemType.COLLECTION) {
        payload = {
          ...payload,
          assignedDate: null,
          attemptAggregation: 'm',
          dueDate: null,
          gradeCategory: '',
          individualize: true,
          isAssigned: '0',
          isPublished: '0',
          cid:
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          multipleAttempts: false,
          numberOfAttemptsAllowed: '1',
          proctorMakesAvailable: false,
          showCorrectness: true,
          showFeedback: true,
          showHints: true,
          showSolution: true,
          showSolutionInGradebook: true,
          timeLimit: null,
          totalPointsOrPercent: '10',
          assignment_isPublished: '0',
        };
      }
      try {
        const resp = await axios.post('/api/addItem.php', payload);
        console.log('resp from add item', resp)
        if (resp.data.success) {
          acceptAddItem(payload);
        } else {
          addToast(`Add item error: ${resp.data.message}`, toastType.ERROR);
        }
      } catch (error) {
        console.error(error);
      }

      // realtime upgrade
      // socket.emit('add_doenetML', payload, (respData) => {
      //   if (respData.success) {
      //     acceptNewItem(payload);
      //   } else {
      //     onAddItemError({ errorMessage: respData });
      //   }
      // });
    },
  );
  /**
   * remove items from the database
   */
  const deleteItem = useRecoilCallback(
    () =>
      async ({ driveIdFolderId, driveInstanceId = null, itemId, label }) => {
        // Remove from database
        const payload = {
          driveId: driveIdFolderId.driveId,
          parentFolderId: driveIdFolderId.folderId,
          itemId: itemId,
          label,
          driveInstanceId,
        };
        try {
          const resp = await axios.get('/api/deleteItem.php', {
            params: payload,
          });

          if (resp.data.success) {
            acceptDeleteItem(payload);
          } else {
            addToast(
              `Delete item error: ${resp.data.message}`,
              toastType.ERROR,
            );
          }
        } catch (error) {
          console.log(error);
        }

        // realtime upgrade
        // socket.emit('delete_doenetML', payload, newFInfo, (respData) => {
        //   if (respData.success) {
        //     acceptDelete(payload, newFInfo, label);
        //   } else {
        //     onDeleteItemError({ errorMessage: respData.message });
        //   }
        // });
      },
  );

  /**
   * @typedef moveOptions
   * @property {string} targetDriveId - destination drive
   * @property {string} targetFolderId - destination folder
   * @property {number} index - insertion index in destination folder
   */

  /**
   * @param {moveOptions} moveOptions - {@link moveOptions}
   */
  const moveItems = useRecoilCallback(({ snapshot, set }) =>
    /**
     * @param {moveOptions} param0 -
     */
    async ({ targetDriveId, targetFolderId, index }) => {
      const globalSelectedNodes = await snapshot.getPromise(
        globalSelectedNodesAtom,
      );
      let destinationFolderObj = await snapshot.getPromise(
        folderDictionary({
          driveId: targetDriveId,
          folderId: targetFolderId,
        }),
      );

      // Interrupt move action if nothing selected
      if (globalSelectedNodes.length === 0) {
        throw 'No items selected';
      }

      // Interrupt move action if dragging folder to itself or adding non ML to Collection
      for (let gItem of globalSelectedNodes) {
        // Get parentInfo from edited cache or derive from oldSource
        const sourceFolderInfo = await snapshot.getPromise(
          folderDictionary({
            driveId: gItem.driveId,
            folderId: gItem.parentFolderId,
          }),
        );
        if (gItem.itemId === targetFolderId) {
          throw 'Cannot move folder into itself';
        } else if (
          destinationFolderObj.folderInfo.itemType === itemType.COLLECTION &&
          sourceFolderInfo.contentsDictionary[gItem.itemId].itemType !==
            itemType.DOENETML
        ) {
          addToast(
            `Can not ${
              sourceFolderInfo.contentsDictionary[gItem.itemId].itemType
            }s into a Collection`,
            toastType.ERROR,
          );
          throw `Can not ${
            sourceFolderInfo.contentsDictionary[gItem.itemId].itemType
          }s into a Collection`;
        }
      }

      // if (canMove){
      // Add to destination at index
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

        let newSourceFInfo = editedCache[gItem.driveId]?.[gItem.parentFolderId];
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

          if (!newDestinationFolderObj['contentsDictionaryByDoenetId']) {
            newDestinationFolderObj['contentsDictionaryByDoenetId'] = {};
          }
          newDestinationFolderObj['contentsDictionaryByDoenetId'][
            newSourceFInfo['contentsDictionary'][gItem.itemId].doenetId
          ] = { ...newSourceFInfo['contentsDictionary'][gItem.itemId] };

          // Remove item from original dictionary
          delete newSourceFInfo['contentsDictionaryByDoenetId'][
            newSourceFInfo['contentsDictionary'][gItem.itemId].doenetId
          ];
          delete newSourceFInfo['contentsDictionary'][gItem.itemId];

          // Ensure item removed from cached parent and added to edited cache
          if (!editedCache[gItem.driveId]) editedCache[gItem.driveId] = {};
          editedCache[gItem.driveId][gItem.parentFolderId] = newSourceFInfo;

          // Insert item into contentIds of destination
          newDestinationFolderObj['contentIds']['defaultOrder'].splice(
            insertIndex,
            0,
            gItem.itemId,
          );
        } else {
          //insert index is only vaild for an array before removal, add in temp obj
          newDestinationFolderObj.contentIds.defaultOrder.splice(
            insertIndex,
            0,
            dragShadowId,
          );
          // remove old instances and splice in new one at corrected index
          newDestinationFolderObj.contentIds.defaultOrder =
            newDestinationFolderObj.contentIds.defaultOrder.filter(
              (itemId) => itemId !== gItem.itemId,
            );
          newDestinationFolderObj.contentIds.defaultOrder.splice(
            newDestinationFolderObj.contentIds.defaultOrder.indexOf(
              dragShadowId,
            ),
            1,
            gItem.itemId,
          );
        }

        // Generate and update sortOrder
        const cleanDefaultOrder =
          newDestinationFolderObj.contentIds.defaultOrder.filter(
            (itemId) => itemId !== dragShadowId,
          );
        newSortOrder = getLexicographicOrder({
          index: insertIndex,
          nodeObjs: newDestinationFolderObj.contentsDictionary,
          defaultFolderChildrenIds: cleanDefaultOrder,
        });
        newDestinationFolderObj['contentsDictionary'][gItem.itemId].sortOrder =
          newSortOrder;
        newDestinationFolderObj['contentsDictionary'][
          gItem.itemId
        ].parentFolderId = targetFolderId;

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
        destinationDriveId: targetDriveId,
        destinationItemId: targetFolderId,
        newSortOrder,
        selectedItemIds,
        selectedItemChildrenIds: driveIdChanged,
        // destinationParentFolderId:
        //   destinationFolderObj.folderInfo.parentFolderId,
      };

      try {
        const resp = await axios.post('/api/moveItems.php', payload);

        if (resp.data.success) {
          acceptMoveItems(payload, newDestinationFolderObj, editedCache);
        } else {
          addToast(`Move item(s) error: ${resp.data.message}`, toastType.ERROR);
        }
      } catch (error) {
        console.log(error);
      }

      // realtime upgrade
      // socket.emit(
      //   'update_file_location',
      //   payload,
      //   newDestinationFolderObj,
      //   editedCache,
      //   (respData) => {
      //     if (respData.success) {
      //       acceptMove(payload, newDestinationFolderObj, editedCache);
      //     } else {
      //       addToast(`Move item(s) error: ${respData.message}`, toastType.ERROR);
      //     }
      //   },
      // );
    },
  );
  const renameItem = useRecoilCallback(
    () =>
      async ({ driveIdFolderId, itemId, itemType, newLabel }) => {
        // Rename in database
        const payload = {
          instruction: 'rename',
          driveId: driveIdFolderId.driveId,
          folderId: driveIdFolderId.folderId,
          itemId: itemId,
          label: newLabel,
          type: itemType,
        };

        try {
          const resp = await axios.get('/api/updateItem.php', {
            params: payload,
          });

          if (resp.data.success) {
            acceptRenameItem(payload);
          } else {
            addToast(
              `Rename item error: ${resp.data.message}`,
              toastType.ERROR,
            );
          }
        } catch (error) {
          console.log(error);
        }

        // realtime upgrade
        // socket.emit('update_file_name', payload, newFInfo, (respData) => {
        //   if (respData.success) {
        //     acceptRenameItem(payload, newFInfo);
        //   } else {
        //     addToast(`Rename item error: ${respData.message}`, toastType.ERROR);
        //   }
        // });
      },
  );

  /**
   * @param {Object[]} items - items to be copied { driveId, driveInstanceId,
   *  itemId, parentFolderId }
   * @param {string} targetDriveId - destination drive ID
   * @param {string} targetFolderId - destination folder ID
   * @param {string} index - insertion index in destination folder
   */
  const copyItems = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ items = [], targetDriveId, targetFolderId, index }) => {
        // Interrupt copy action if items is empty
        if (items.length === 0) {
          throw 'No items to be copied';
        }

        let destinationFolderObj = await snapshot.getPromise(
          folderDictionary({
            driveId: targetDriveId,
            folderId: targetFolderId,
          }),
        );
        let newDestinationFolderObj = JSON.parse(
          JSON.stringify(destinationFolderObj),
        );
        const insertIndex = index ?? 0;
        let newSortOrder = '';
        const dt = new Date();
        const creationTimestamp = formatDate(dt); //TODO: Emilio Make sure we have the right time zones
        let globalDictionary = {};
        let globalContentIds = {};

        for (let item of items) {
          if (!item.driveId || !item.driveInstanceId || !item.itemId)
            throw 'Invalid arguments error';

          // Deselect currently selected items
          let selectedItem = {
            driveId: item.driveId,
            driveInstanceId: item.driveInstanceId,
            itemId: item.itemId,
          };
          set(selectedDriveItemsAtom(selectedItem), false);

          // Clone target item and its children
          const { newItemId, newItem } = await cloneItem({
            snapshot,
            globalDictionary,
            globalContentIds,
            creationTimestamp,
            item,
            targetDriveId,
            targetFolderId,
          });

          // Specify copy in label when copying within same drive
          if (item.driveId === targetDriveId) {
            const newItemLabel = `Copy of ${newItem.label}`;
            newItem.label = newItemLabel;
          }

          // Generate sortOrder for cloned item
          const cleanDefaultOrder = newDestinationFolderObj['contentIds'][
            'defaultOrder'
          ].filter((itemId) => itemId !== dragShadowId);
          newSortOrder = getLexicographicOrder({
            index: insertIndex,
            nodeObjs: newDestinationFolderObj.contentsDictionary,
            defaultFolderChildrenIds: cleanDefaultOrder,
          });
          newItem.sortOrder = newSortOrder;

          // Insert root of cloned tree/item into destination
          newDestinationFolderObj['contentsDictionary'][newItemId] = newItem;
          newDestinationFolderObj['contentIds']['defaultOrder'].splice(
            insertIndex,
            0,
            newItemId,
          );
        }

        // Clear global selection
        set(globalSelectedNodesAtom, []);

        let promises = [];
        for (let newItemId of Object.keys(globalDictionary)) {
          let newItem = globalDictionary[newItemId];

          const addItemsParams = {
            driveId: targetDriveId,
            parentFolderId: newItem.parentFolderId,
            itemId: newItemId,
            doenetId: newItem.doenetId,
            versionId: newItem.versionId,
            label: newItem.label,
            type: newItem.itemType,
            sortOrder: newItem.sortOrder,
            isNewCopy: '1',
          };

          // Clone DoenetML
          if (newItem.itemType === 'DoenetML') {
            const newDoenetML = cloneDoenetML({
              item: newItem,
              timestamp: creationTimestamp,
            });

            promises.push(axios.post('/api/saveNewVersion.php', newDoenetML));

            // Unify new doenetId
            // addItemsParams["doenetId"] = newDoenetML?.doenetId;
          }

          const result = axios.get('/api/addItem.php', {
            params: addItemsParams,
          });
          promises.push(result);
        }

        Promise.allSettled(promises)
          .then(([result]) => {
            if (result.value?.data?.success) {
              // Update destination folder
              set(
                folderDictionary({
                  driveId: targetDriveId,
                  folderId: targetFolderId,
                }),
                newDestinationFolderObj,
              );

              // Add new cloned items into folderDictionary
              for (let newItemId of Object.keys(globalDictionary)) {
                let newItem = globalDictionary[newItemId];
                if (newItem.itemType === 'Folder') {
                  // BFS tree-walk to iterate through tree nodes
                  let queue = [newItemId];
                  while (queue.length) {
                    const size = queue.length;
                    for (let i = 0; i < size; i++) {
                      const currentItemId = queue.shift();
                      const currentItem = globalDictionary[currentItemId];
                      if (currentItem.itemType !== 'Folder') continue;

                      // Build contentsDictionary
                      let contentsDictionary = {};
                      for (let childContentId of globalContentIds[
                        currentItemId
                      ]) {
                        contentsDictionary = {
                          ...contentsDictionary,
                          [childContentId]: globalDictionary[childContentId],
                        };
                      }

                      // Build folder info object
                      const currentFolderInfoObj = {
                        folderInfo: currentItem,
                        contentsDictionary,
                        contentIds: {
                          [sortOptions.DEFAULT]:
                            globalContentIds[currentItemId],
                        },
                      };

                      // Add current folder into folderDictionary
                      set(
                        folderDictionary({
                          driveId: targetDriveId,
                          folderId: currentItemId,
                        }),
                        currentFolderInfoObj,
                      );

                      queue = [...queue, ...globalContentIds[currentItemId]];
                    }
                  }
                }
              }

              // Mark current folder as dirty
              set(
                folderCacheDirtyAtom({
                  driveId: targetDriveId,
                  folderId: targetFolderId,
                }),
                true,
              );
            }
          })
          .catch((err) => {
            console.error(err);
          });

        const result = await Promise.allSettled(promises);
        return result;
      },
  );

  const cloneItem = async ({
    snapshot,
    globalDictionary = {},
    globalContentIds = {},
    creationTimestamp,
    item,
    targetDriveId,
    targetFolderId,
  }) => {
    // Retrieve info of target item from parentFolder
    const itemParentFolder = await snapshot.getPromise(
      folderDictionary({
        driveId: item.driveId,
        folderId: item.parentFolderId,
      }),
    );
    const itemInfo = itemParentFolder['contentsDictionary'][item.itemId];

    // Clone item (Note this should be the source of new ids)
    const newItem = { ...itemInfo };
    const newItemId = nanoid();
    newItem.itemId = newItemId;
    newItem.doenetId = nanoid();
    newItem.versionId = nanoid();
    newItem.previousDoenetId = itemInfo.doenetId;

    if (itemInfo.itemType === 'Folder') {
      const { contentIds } = await snapshot.getPromise(
        folderDictionary({ driveId: item.driveId, folderId: item.itemId }),
      );
      globalContentIds[newItemId] = [];
      for (let cid of contentIds[sortOptions.DEFAULT]) {
        let subItem = {
          ...item,
          parentFolderId: item.itemId,
          itemId: cid,
        };
        let result = await cloneItem({
          snapshot,
          globalDictionary,
          globalContentIds,
          creationTimestamp,
          item: subItem,
          targetFolderId: newItemId,
          targetDriveId,
        });
        const newSubItemId = result.newItemId;
        globalContentIds[newItemId].push(newSubItemId);
      }
    }

    newItem.parentFolderId = targetFolderId;
    newItem.creationDate = creationTimestamp;
    globalDictionary[newItemId] = newItem;

    return { newItemId, newItem };
  };

  const cloneDoenetML = ({ item, timestamp }) => {
    let newVersion = {
      title: item.label,
      doenetId: item.doenetId,
      // doenetId: nanoid(),
      cid: item.cid,
      versionId: item.versionId,
      timestamp,
      isDraft: '0',
      isNamed: '1',
      isNewCopy: '1',
      doenetML: item.doenetML,
      previousDoenetId: item.previousDoenetId,
    };
    return newVersion;
  };

  // result
  //   .then(([resp]) => {
  //     if (resp.value?.data?.success) {
  //       addToast(
  //         `Copied ${replaceDragShadowResp?.numItems} item(s)`,
  //         toastType.SUCCESS,
  //       );
  //     } else {
  //       onCopyItemsError({ errorMessage: resp?.reason });
  //     }
  //   })
  //   .catch((e) => {
  //     onCopyItemsError({ errorMessage: e.message });
  //   });

  // realtime upgrade
  // const [bindings] = useState({
  //   drive: [
  //     {
  //       eventName: 'connection',
  //       callback: () => {
  //         console.log('Socket', socket.id, 'connected');
  //       },
  //     },
  //     {
  //       eventName: 'remote_add_doenetML',
  //       callback: acceptAddItem,
  //     },
  //     {
  //       eventName: 'remote_add_folder',
  //       callback: acceptAddItem,
  //     },
  //     {
  //       eventName: 'remote_delete_doenetML',
  //       callback: acceptDeleteItem,
  //     },
  //     {
  //       eventName: 'remote_update_file_locaiton',
  //       callback: acceptMoveItems,
  //     },
  //     {
  //       eventName: 'remote_update_file_name',
  //       callback: acceptRenameItem,
  //     },
  //   ],
  // });

  // realtime upgrade
  // useEffect(() => {
  //   // console.log('>>>configure', namespace);
  //   bindings[namespace].map((bind) => {
  //     if (!socket.hasListeners(bind.eventName)) {
  //       socket.on(bind.eventName, bind.callback);
  //     }
  //   });
  //   return () => {
  //     // console.log('>>>disconnect', namespace);
  //     // socket.disconnect();
  //     //TODO: socket disconnect logic
  //   };
  // }, [bindings, socket, namespace]);

  return {
    addItem,
    deleteItem,
    moveItems,
    renameItem,
    copyItems,
  };
}

function useAcceptBindings() {
  const addToast = useToast();

  /**
   * execute local changes after a successful local or remote item addtion
   */
  const acceptAddItem = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({
        driveId,
        parentFolderId,
        doenetId,
        versionId,
        itemId,
        type,
        label,
        sortOrder,
        creationDate,
        url,
        selectedItemId,
      }) => {
        // create default item
        const newItem = {
          parentFolderId,
          doenetId,
          versionId,
          itemId,
          itemType: type,
          label,
          sortOrder,
          creationDate, //get this from sever??
          isPublished: '0',
          url,
          urlDescription: null,
          urlId: null,
        };

        // insert into sort order
        const fInfo = await snapshot.getPromise(
          folderDictionary({
            driveId: driveId,
            folderId: parentFolderId,
          }),
        );
        let newObj = JSON.parse(JSON.stringify(fInfo));
        let newDefaultOrder = [...newObj.contentIds[sortOptions.DEFAULT]];
        let index = newDefaultOrder.indexOf(selectedItemId);
        newDefaultOrder.splice(index + 1, 0, itemId);
        newObj.contentIds[sortOptions.DEFAULT] = newDefaultOrder;
        newObj.contentsDictionary[itemId] = newItem;
        newObj.contentsDictionaryByDoenetId[doenetId] = newItem;

        // Insert item info into destination folder
        set(
          folderDictionary({
            driveId: driveId,
            folderId: parentFolderId,
          }),
          newObj,
        );

        // addtional folder type updates
        if (type === 'Folder' || type === 'Collection') {
          set(
            folderDictionary({
              driveId: driveId,
              folderId: itemId,
            }),
            {
              folderInfo: newItem,
              contentsDictionary: {},
              contentIds: { [sortOptions.DEFAULT]: [] },
            },
          );
        }

        addToast(`Add new item 'Untitled'`, toastType.SUCCESS);
      },
    [addToast],
  );

  /**
   * execute local changes after successful remote item deletion
   */
  const acceptDeleteItem = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ driveId, parentFolderId, itemId, driveInstanceId, label }) => {
        const fInfo = await snapshot.getPromise(
          folderDictionary({ driveId, folderId: parentFolderId }),
        );
        const globalSelectedNodes = await snapshot.getPromise(
          globalSelectedNodesAtom,
        );

        const item = {
          driveId,
          driveInstanceId,
          itemId,
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
        newFInfo['contentsDictionaryByDoenetId'] = {
          ...fInfo.contentsDictionaryByDoenetId,
        };

        delete newFInfo['contentsDictionaryByDoenetId'][
          newFInfo['contentsDictionary'][itemId].doenetId
        ];
        delete newFInfo['contentsDictionary'][itemId];
        newFInfo.folderInfo = { ...fInfo.folderInfo };
        newFInfo.contentIds = {};
        newFInfo.contentIds[sortOptions.DEFAULT] = [
          ...fInfo.contentIds[sortOptions.DEFAULT],
        ];
        const index = newFInfo.contentIds[sortOptions.DEFAULT].indexOf(itemId);
        newFInfo.contentIds[sortOptions.DEFAULT].splice(index, 1);

        set(
          folderDictionary({
            driveId,
            folderId: parentFolderId,
          }),
          newFInfo,
        );
        addToast(`Deleted item '${label}'`, toastType.SUCCESS);
      },
  );

  const acceptMoveItems = useRecoilCallback(
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
        // addToast(`Item to '${'te'}'`, toastType.SUCCESS);
      },
    [],
  );

  const acceptRenameItem = useRecoilCallback(
    ({ snapshot, set }) =>
      async ({ driveId, folderId, itemId, label, type }) => {
        const fInfo = await snapshot.getPromise(
          folderDictionary({ driveId, folderId }),
        );

        // Rename in folder
        let newFInfo = { ...fInfo };
        newFInfo['contentsDictionary'] = { ...fInfo.contentsDictionary };
        newFInfo['contentsDictionaryByDoenetId'] = {
          ...fInfo.contentsDictionaryByDoenetId,
        };

        newFInfo['contentsDictionary'][itemId] = {
          ...fInfo.contentsDictionary[itemId],
        };
        newFInfo['contentsDictionary'][itemId].label = label;

        newFInfo['contentsDictionaryByDoenetId'][
          newFInfo['contentsDictionary'][itemId].doenetId
        ] = {
          ...fInfo.contentsDictionary[itemId],
        };
        newFInfo['contentsDictionaryByDoenetId'][
          newFInfo['contentsDictionary'][itemId].doenetId
        ].label = label;

        set(
          folderDictionary({
            driveId,
            folderId,
          }),
          newFInfo,
        );

        // If a folder, update the label in the child folder
        if (type === 'Folder' || type === 'Collection') {
          set(
            folderDictionary({
              driveId,
              folderId: itemId,
            }),
            (old) => {
              let newFolderInfo = { ...old };
              newFolderInfo.folderInfo = { ...old.folderInfo };
              newFolderInfo.folderInfo.label = label;
              return newFolderInfo;
            },
          );
        }
        addToast(`Renamed item to '${label}'`, toastType.SUCCESS);
      },
  );

  return {
    acceptAddItem,
    acceptDeleteItem,
    acceptMoveItems,
    acceptRenameItem,
  };
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
// const newItem = {
//   parentFolderId: driveIdFolderId.folderId,
//   doenetId,
//   itemId,
//   itemType: itemType,
//   label: label,
//   creationDate,
//   isPublished: '0',
//   url: url,
//   urlDescription: null,
//   urlId: null,
//   sortOrder: '',
// };
