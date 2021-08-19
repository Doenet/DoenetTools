import React, {Suspense, useState, useEffect} from "../../_snowpack/pkg/react.js";
import {
  atomFamily,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {faMinus, faPlus} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import {folderDictionaryFilterSelector} from "../../_reactComponents/Drive/NewDrive.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import DoenetViewer from "../../viewer/DoenetViewer.js";
import {
  fileByContentId,
  itemHistoryAtom
} from "../ToolHandlers/CourseToolHandler.js";
import axios from "../../_snowpack/pkg/axios.js";
export default function CollectionEditor() {
  const [driveId, , itemId] = useRecoilValue(searchParamAtomFamily("path")).split(":");
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const [availableEntries, setAvailableEntries] = useState([]);
  const initEntryByDoenetId = useRecoilCallback(({snapshot, set}) => async (doenetId2) => {
    const release = snapshot.retain();
    try {
      const versionHistory = await snapshot.getPromise(itemHistoryAtom(doenetId2));
      let contentId = null;
      for (const version in versionHistory?.named) {
        if (versionHistory?.named[version]?.isReleased === "1") {
          contentId = versionHistory.named[version].contentId;
          break;
        }
      }
      let response = await snapshot.getPromise(fileByContentId(contentId));
      if (typeof response === "object") {
        response = response.data;
      }
      set(hiddenViewerByDoenetId(doenetId2), /* @__PURE__ */ React.createElement("div", {
        style: {display: "none"}
      }, /* @__PURE__ */ React.createElement(DoenetViewer, {
        doenetML: response,
        generatedVariantCallback: (generatedVariantInfo, allPossibleVariants) => {
          const cleanGeneratedVariant = JSON.parse(JSON.stringify(generatedVariantInfo));
          cleanGeneratedVariant.lastUpdatedIndexOrName = null;
          set(possibleVariantsByDoenetId(doenetId2), {
            index: cleanGeneratedVariant.index,
            name: cleanGeneratedVariant.name,
            allPossibleVariants
          });
        }
      })));
    } finally {
      release();
    }
  }, []);
  const assignedEntries = useRecoilValueLoadable(assignedEntiresQuery(doenetId)).getValue();
  const folderInfoObj = useRecoilValueLoadable(folderDictionaryFilterSelector({
    driveId,
    folderId: itemId
  })).getValue();
  useEffect(() => {
    const entries = [];
    for (let key in folderInfoObj.contentsDictionary) {
      const {doenetId: doenetId2} = folderInfoObj.contentsDictionary[key];
      initEntryByDoenetId(doenetId2);
      entries.push(/* @__PURE__ */ React.createElement(Suspense, {
        key
      }, /* @__PURE__ */ React.createElement(CollectionEntry, {
        doenetId: doenetId2,
        collectionDoenetId: folderInfoObj.folderInfo.doenetId
      })));
    }
    setAvailableEntries(entries);
  }, [folderInfoObj, initEntryByDoenetId]);
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      rowGap: "4px",
      maxWidth: "850px",
      margin: "10px 20px"
    }
  }, assignedEntries, /* @__PURE__ */ React.createElement("div", {
    style: {height: "10px", background: "black"}
  }), availableEntries);
}
const hiddenViewerByDoenetId = atomFamily({
  key: "hiddenViewerByDoenetId",
  default: null
});
const possibleVariantsByDoenetId = atomFamily({
  key: "possibleVariantsByDoenetId",
  default: {}
});
const entryInfoByDoenetId = atomFamily({
  key: "itemInfoByDoenetId",
  default: selectorFamily({
    key: "itemInfoByDoenetId/Default",
    get: (doenetId) => async ({get}) => {
      try {
        const resp = await axios.get("/api/findDriveIdFolderId.php", {
          params: {doenetId}
        });
        if (resp.status === 200) {
          const folderInfo = await get(folderDictionaryFilterSelector({
            driveId: resp.data.driveId,
            folderId: resp.data.parentFolderId
          }));
          return folderInfo.contentsDictionaryByDoenetId[doenetId];
        }
      } catch (error) {
        console.error(error);
        return {};
      }
    }
  })
});
const assignedEntiresQuery = atomFamily({
  key: "assignedEntiresQuery",
  default: selectorFamily({
    key: "assignedEntiresQuery/Default",
    get: (doenetId) => async () => {
      try {
        const resp = await axios.get("/api/loadCollection.php", {
          params: {doenetId}
        });
        const entries = [];
        if (resp.status === 200) {
          for (let key in resp.data.entries) {
            const {collectionDoenetId, entryDoenetId, entryId, variant} = resp.data.entries[key];
            entries.push(/* @__PURE__ */ React.createElement(Suspense, {
              key: entryId
            }, /* @__PURE__ */ React.createElement(CollectionEntry, {
              collectionDoenetId,
              doenetId: entryDoenetId,
              entryId,
              variant,
              assigned: true
            })));
          }
        }
        return entries;
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  })
});
function CollectionEntry({
  collectionDoenetId,
  doenetId,
  entryId,
  assigned,
  variant
}) {
  const hiddenViewer = useRecoilValue(hiddenViewerByDoenetId(doenetId));
  const [selectedVariant, setSelectedVariant] = useState(variant);
  const setAssignedEntries = useSetRecoilState(assignedEntiresQuery(collectionDoenetId));
  const entryInfo = useRecoilValueLoadable(entryInfoByDoenetId(doenetId)).getValue();
  const variants = useRecoilValueLoadable(possibleVariantsByDoenetId(doenetId)).getValue();
  const [selectOptions, setSelectOptions] = useState([]);
  useEffect(() => {
    const options = [];
    for (let key in variants.allPossibleVariants) {
      options.push(/* @__PURE__ */ React.createElement("option", {
        key: variants.allPossibleVariants[key],
        value: variants.allPossibleVariants[key]
      }, variants.allPossibleVariants[key]));
    }
    setSelectOptions(options);
  }, [variants.allPossibleVariants]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CollectionEntryDisplayLine, {
    label: entryInfo.label,
    assigned,
    selectOptions,
    selectedVariant,
    addEntryToAssignment: () => {
      const entryId2 = nanoid();
      axios.post("/api/addCollectionEntry.php", {
        collectionDoenetId,
        entryDoenetId: doenetId,
        label: entryInfo.label,
        entryId: entryId2,
        variant: variants.allPossibleVariants[0]
      }).then((resp) => {
        if (resp.status === 200) {
          setAssignedEntries((was) => [
            ...was,
            /* @__PURE__ */ React.createElement(Suspense, {
              key: entryId2
            }, /* @__PURE__ */ React.createElement(CollectionEntry, {
              collectionDoenetId,
              doenetId,
              entryId: entryId2,
              label: entryInfo?.label,
              variant: variants.allPossibleVariants[0],
              assigned: true
            }))
          ]);
        }
      });
    },
    removeEntryFromAssignment: () => {
      axios.post("/api/removeCollectionEntry.php", {entryId}).then((resp) => {
        if (resp.status === 200) {
          setAssignedEntries((was) => was.filter((entryJSX) => entryJSX.key !== entryId));
        }
      });
    },
    onVariantSelect: (newSelectedVariant) => {
      axios.post("/api/updateCollectionEntryVariant.php", {
        entryId,
        variant: newSelectedVariant
      }).then(() => {
        setSelectedVariant(newSelectedVariant);
      }).catch((error) => console.error(error));
    }
  }), !assigned ? hiddenViewer : null);
}
function CollectionEntryDisplayLine({
  label,
  addEntryToAssignment,
  removeEntryFromAssignment,
  assigned,
  selectedVariant,
  selectOptions,
  onVariantSelect
}) {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      background: "#e3e3e3",
      borderRadius: "4px",
      padding: "4px"
    }
  }, /* @__PURE__ */ React.createElement("span", {
    style: {flexGrow: 1}
  }, label), /* @__PURE__ */ React.createElement(ButtonGroup, null, assigned ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("select", {
    value: selectedVariant,
    onChange: (e) => {
      e.stopPropagation();
      onVariantSelect?.(e.target.value);
    }
  }, selectOptions), /* @__PURE__ */ React.createElement(Button, {
    value: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faMinus
    }),
    onClick: (e) => {
      e.stopPropagation();
      removeEntryFromAssignment?.();
    }
  })) : /* @__PURE__ */ React.createElement(Button, {
    value: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faPlus
    }),
    onClick: (e) => {
      e.stopPropagation();
      addEntryToAssignment?.();
    }
  })));
}
