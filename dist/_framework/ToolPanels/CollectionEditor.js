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
import {
  fileByContentId,
  itemHistoryAtom
} from "../ToolHandlers/CourseToolHandler.js";
import axios from "../../_snowpack/pkg/axios.js";
import {returnAllPossibleVariants} from "../../core/utils/returnAllPossibleVariants.js";
import {itemType} from "../../_reactComponents/Sockets.js";
import {
  serializedComponentsReplacer,
  serializedComponentsReviver
} from "../../core/utils/serializedStateProcessing.js";
import {csvGroups} from "../Menus/GroupSettings.js";
export default function CollectionEditor() {
  const [driveId, , itemId] = useRecoilValue(searchParamAtomFamily("path")).split(":");
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const [availableEntries, setAvailableEntries] = useState([]);
  const [assignedEntries, setAssignedEntries] = useState([]);
  const initEntryByDoenetId = useRecoilCallback(({snapshot, set}) => async (doenetId2) => {
    const release = snapshot.retain();
    try {
      const versionHistory = await snapshot.getPromise(itemHistoryAtom(doenetId2));
      let cid = null;
      for (const version in versionHistory?.named) {
        if (versionHistory?.named[version]?.isReleased === "1") {
          cid = versionHistory.named[version].cid;
          break;
        }
      }
      let response = await snapshot.getPromise(fileByContentId(cid));
      if (typeof response === "object") {
        response = response.data;
      }
      returnAllPossibleVariants({
        doenetML: response,
        callback: ({allPossibleVariants}) => {
          set(possibleVariantsByDoenetId(doenetId2), allPossibleVariants);
        }
      });
    } finally {
      release();
    }
  }, []);
  const assignedEntriesData = useRecoilValueLoadable(assignedEntiresInfo(doenetId)).getValue();
  useEffect(() => {
    const entries = [];
    for (let key in assignedEntriesData) {
      const {doenetId: doenetId2, entryId, entryDoenetId, entryVariant} = assignedEntriesData[key];
      entries.push(/* @__PURE__ */ React.createElement(Suspense, {
        key: entryId
      }, /* @__PURE__ */ React.createElement(CollectionEntry, {
        collectionDoenetId: doenetId2,
        doenetId: entryDoenetId,
        entryId,
        variant: JSON.parse(entryVariant, serializedComponentsReviver).name,
        assigned: true
      })));
    }
    setAssignedEntries(entries);
  }, [assignedEntriesData]);
  const folderInfoObj = useRecoilValueLoadable(folderDictionaryFilterSelector({
    driveId,
    folderId: itemId
  })).getValue();
  useEffect(() => {
    const entries = [];
    for (let key in folderInfoObj.contentsDictionary) {
      if (folderInfoObj.contentsDictionary[key].itemType === itemType.DOENETML) {
        const {doenetId: doenetId2, isReleased} = folderInfoObj.contentsDictionary[key];
        if (isReleased == "1") {
          initEntryByDoenetId(doenetId2);
          entries.push(/* @__PURE__ */ React.createElement(Suspense, {
            key
          }, /* @__PURE__ */ React.createElement(CollectionEntry, {
            collectionDoenetId: folderInfoObj.folderInfo.doenetId,
            doenetId: doenetId2
          })));
        }
      }
    }
    setAvailableEntries(entries);
    return () => {
      setAvailableEntries([]);
    };
  }, [folderInfoObj, initEntryByDoenetId]);
  if (availableEntries.length === 0) {
    return /* @__PURE__ */ React.createElement("div", {
      style: {
        padding: "8px"
      }
    }, /* @__PURE__ */ React.createElement("p", null, "No Relesed DoenetML files were found in this Colletion. Please add files from the Content screen to continue."));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      rowGap: "4px",
      maxWidth: "850px",
      margin: "10px 20px"
    }
  }, assignedEntries, /* @__PURE__ */ React.createElement("div", {
    style: {height: "10px", background: "black", borderRadius: "4px"}
  }), availableEntries, /* @__PURE__ */ React.createElement("div", {
    style: {height: "10px", background: "black", borderRadius: "4px"}
  }), /* @__PURE__ */ React.createElement(GroupsVerificationTable, {
    doenetId
  }));
}
const possibleVariantsByDoenetId = atomFamily({
  key: "possibleVariantsByDoenetId",
  default: []
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
        const folderInfo = await get(folderDictionaryFilterSelector({
          driveId: resp.data.driveId,
          folderId: resp.data.parentFolderId
        }));
        console.log("Finfo", folderInfo, folderInfo.contentsDictionaryByDoenetId[doenetId]);
        return folderInfo.contentsDictionaryByDoenetId[doenetId] ?? {};
      } catch (error) {
        console.error(error);
        return {};
      }
    }
  })
});
const assignedEntiresInfo = atomFamily({
  key: "assignedEntiresInfo",
  default: selectorFamily({
    key: "assignedEntiresInfo/Default",
    get: (doenetId) => async () => {
      try {
        if (doenetId) {
          const resp = await axios.get("/api/loadCollection.php", {
            params: {doenetId}
          });
          return resp.data.entries ?? [];
        } else {
          console.warn("undefined doenetId in Collections Editor");
          return [];
        }
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
  const setAssignedEntries = useSetRecoilState(assignedEntiresInfo(collectionDoenetId));
  const entryInfo = useRecoilValueLoadable(entryInfoByDoenetId(doenetId)).getValue();
  const variants = useRecoilValueLoadable(possibleVariantsByDoenetId(doenetId)).getValue();
  const [selectOptions, setSelectOptions] = useState([]);
  useEffect(() => {
    const options = [];
    for (let key in variants) {
      options.push(/* @__PURE__ */ React.createElement("option", {
        key: variants[key],
        value: variants[key]
      }, variants[key]));
    }
    setSelectOptions(options);
  }, [variants]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CollectionEntryDisplayLine, {
    label: entryInfo.label,
    assigned,
    selectOptions,
    selectedVariant: variant,
    addEntryToAssignment: () => {
      const entryId2 = nanoid();
      axios.post("/api/addCollectionEntry.php", {
        doenetId: collectionDoenetId,
        entryId: entryId2,
        entryDoenetId: doenetId,
        entryVariant: JSON.stringify({name: variants[0]}, serializedComponentsReplacer)
      }).then(() => {
        setAssignedEntries((was) => [
          ...was,
          {
            doenetId: collectionDoenetId,
            entryId: entryId2,
            entryDoenetId: doenetId,
            entryVariant: JSON.stringify({name: variants[0]}, serializedComponentsReplacer)
          }
        ]);
      }).catch((error) => {
        console.error(error);
      });
    },
    removeEntryFromAssignment: () => {
      axios.post("/api/removeCollectionEntry.php", {entryId}).then(() => {
        setAssignedEntries((was) => was.filter((entry) => entry.entryId !== entryId));
      }).catch((error) => {
        console.error(error);
      });
    },
    onVariantSelect: (newSelectedVariant) => {
      axios.post("/api/updateCollectionEntryVariant.php", {
        entryId,
        entryVariant: JSON.stringify({name: newSelectedVariant}, serializedComponentsReplacer)
      }).then(() => {
        setAssignedEntries((was) => was.map((entry) => {
          if (entry.entryId === entryId) {
            return {
              ...entry,
              entryVariant: JSON.stringify({name: newSelectedVariant}, serializedComponentsReplacer)
            };
          } else {
            return entry;
          }
        }));
      }).catch((error) => console.error(error));
    }
  }));
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
    },
    onBlur: (e) => {
      if (e.target.value !== selectedVariant) {
        onVariantSelect?.(e.target.value);
      }
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
function GroupsVerificationTable({doenetId}) {
  const {namesByGroup, emailsByGroup} = useRecoilValue(csvGroups(doenetId));
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "8px"
    }
  }, emailsByGroup?.map((group, idx) => {
    if (group.length > 0) {
      return /* @__PURE__ */ React.createElement("table", {
        key: idx,
        style: {
          borderCollapse: "collapse",
          width: "100%",
          borderRadius: "4px",
          overflow: "hidden"
        }
      }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", {
        colSpan: 3,
        style: {
          textAlign: "center",
          backgroundColor: "#1a5a99",
          color: "white",
          borderBottom: "2px solid black"
        }
      }, "Group ", idx + 1)), /* @__PURE__ */ React.createElement("tr", {
        style: {
          backgroundColor: "#1a5a99",
          color: "white"
        }
      }, /* @__PURE__ */ React.createElement("th", {
        style: {
          whiteSpace: "nowrap",
          borderRight: "2px solid black"
        }
      }, "First"), /* @__PURE__ */ React.createElement("th", {
        style: {
          whiteSpace: "nowrap"
        }
      }, "Last"), /* @__PURE__ */ React.createElement("th", {
        style: {
          whiteSpace: "nowrap",
          borderLeft: "2px solid black"
        }
      }, "Email"))), /* @__PURE__ */ React.createElement("tbody", null, group.map((email, idz) => /* @__PURE__ */ React.createElement("tr", {
        key: email
      }, /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, namesByGroup[idx][idz].firstName), /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, namesByGroup[idx][idz].lastName), /* @__PURE__ */ React.createElement("td", {
        style: {textAlign: "center"}
      }, email)))));
    }
  }));
}
