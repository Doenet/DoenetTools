/**
 * External dependencies
 */
import React, { useEffect, useState, useContext } from 'react';

import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilState,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilCallback,
  atomFamily,
} from 'recoil';
import axios from 'axios';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

/**
 * Internal dependencies
 */
import Drive, {
  folderDictionaryFilterSelector,
  clearDriveAndItemSelections,
  drivePathSyncFamily,
  folderDictionaryFilterAtom,
} from '../../_reactComponents/Drive/Drive';
import { BreadcrumbContainer } from '../../_reactComponents/Breadcrumb';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';
import Increment from '../../_reactComponents/PanelHeaderComponents/IncrementMenu';
// import DateTime from '../../_reactComponents/PanelHeaderComponents/DateTime'; //TODO
import DriveCards from '../../_reactComponents/Drive/DriveCards';
import '../../_reactComponents/Drive/drivecard.css';
import '../../_utils/util.css';
import GlobalFont from '../../_utils/GlobalFont';
import Tool from '../_framework/Tool';
import Switch from "../_framework/Switch";
import { useToolControlHelper, ProfileContext } from '../_framework/ToolRoot';
import { useToast } from '../_framework/Toast';
import { URLPathSync } from '../library/Library';
import Enrollment from './Enrollment';
import { useAssignment } from '../course/CourseActions';
import { useAssignmentCallbacks } from '../../_reactComponents/Drive/DriveActions';
import { selectedInformation } from '../library/Library';
import { itemHistoryAtom, fileByContentId } from '../../_sharedRecoil/content';

const versionHistoryReleasedSelectedAtom = atom({
  key: 'versionHistoryReleasedSelectedAtom',
  default: '',
});
const viewerDoenetMLAtom = atom({
  key: 'viewerDoenetMLAtom',
  default: { updateNumber: 0, doenetML: '' },
});
export const roleAtom = atom({
  key: 'roleAtom',
  default: 'Instructor',
});
export const selectedVersionAtom = atom({
  key: 'selectedVersionAtom',
  default: '',
});
export const loadAssignmentSelector = selectorFamily({
  key: 'loadAssignmentSelector',
  get:
    (doenetId) =>
    async ({ get, set }) => {
      const { data } = await axios.get(
        `/api/getAllAssignmentSettings.php?doenetId=${doenetId}`,
      );
      return data;
    },
});
export const assignmentDictionary = atomFamily({
  key: 'assignmentDictionary',
  default: selectorFamily({
    key: 'assignmentDictionary/Default',
    get:
      (driveIditemIddoenetIdparentFolderId) =>
      async ({ get }, instructions) => {
        let folderInfoQueryKey = {
          driveId: driveIditemIddoenetIdparentFolderId.driveId,
          folderId: driveIditemIddoenetIdparentFolderId.folderId,
        };
        let folderInfo = get(
          folderDictionaryFilterSelector(folderInfoQueryKey),
        );
        const itemObj =
          folderInfo?.contentsDictionary?.[
            driveIditemIddoenetIdparentFolderId.itemId
          ];
        if (driveIditemIddoenetIdparentFolderId.doenetId) {
          const aInfo = await get(
            loadAssignmentSelector(
              driveIditemIddoenetIdparentFolderId.doenetId,
            ),
          );
          if (aInfo) {
            return aInfo?.assignments[0];
          } else return null;
        } else return null;
      },
  }),
});
let assignmentDictionarySelector = selectorFamily({
  key: 'assignmentDictionaryNewSelector',
  get:
    (driveIditemIddoenetIdparentFolderId) =>
    ({ get }) => {
      return get(assignmentDictionary(driveIditemIddoenetIdparentFolderId));
    },
});

function Container(props) {
  return (
    <div
      style={{
        maxWidth: '850px',
        padding: '20px',
        display: 'grid',
      }}
    >
      {props.children}
    </div>
  );
}

function AutoSelect(props) {
  const { activateMenuPanel } = useToolControlHelper();

  const contentInfoLoad = useRecoilValueLoadable(selectedInformation);
  if(contentInfoLoad.state === "hasValue"){
    const versionHistory = useRecoilValueLoadable(itemHistoryAtom(contentInfoLoad?.contents?.itemInfo?.doenetId))

    if (versionHistory.state === "loading"){ return null;}
    if (versionHistory.state === "hasError"){ 
      console.error(versionHistory.contents)
      return null;}
      if (versionHistory.state === "hasValue"){ 
        const contentId = versionHistory.contents.named.contentId;
       }
  }
  if (contentInfoLoad?.contents?.number > 0) {
    activateMenuPanel(0);
  } else {
    activateMenuPanel(1);
  }
  return null;
}

export default function Course(props) {
  const { openOverlay, activateMenuPanel } = useToolControlHelper();
  const [toast, toastType] = useToast();
  let routePathDriveId = '';
  let routePathFolderId = '';
  let pathItemId = '';
  let itemType = '';
  let urlParamsObj = Object.fromEntries(
    new URLSearchParams(props.route.location.search),
  );
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);
  const [openEnrollment, setEnrollmentView] = useState(false);
  const role = useRecoilValue(roleAtom);
  const setDrivePath = useSetRecoilState(drivePathSyncFamily('main'));

  if (urlParamsObj?.path !== undefined) {
    [routePathDriveId, routePathFolderId, pathItemId, itemType] =
      urlParamsObj.path.split(':');
  }
  if (urlParamsObj?.path !== undefined) {
    [routePathDriveId] = urlParamsObj.path.split(':');
  }
  // const [init,setInit]  = useState(false)
  // const setFilteredDrive = useSetRecoilState(folderDictionaryFilterAtom({driveId:routePathDriveId}));
  const [filter, setFilteredDrive] = useRecoilState(
    folderDictionaryFilterAtom({ driveId: routePathDriveId }),
  );
  //Select +Add menuPanel if no course selected on startup
  useEffect(() => {
    if (routePathDriveId === '') {
      activateMenuPanel(1);
    }
  }, []);

  //Default filter
  if (filter === 'All') {
    setFilteredDrive('Released Only');
  }

  //Wait for the filter to change
  if (filter === 'All' && routePathDriveId !== '') {
    return null;
  }
  let columnsArr = [];
  if(filter === 'Released Only'){
    columnsArr.push('Due Date', 'Assigned')
  }else{
    columnsArr.push('Due Date')
  }
  function cleardrivecardSelection() {
    setDrivePath({
      driveId: '',
      parentFolderId: '',
      itemId: '',
      type: '',
    });
  }
  function outsideDriveSelection() {
    setDrivePath({
      driveId: '',
      parentFolderId: '',
      itemId: '',
      type: '',
    });
  }
  let breadcrumbContainer = <BreadcrumbContainer drivePathSyncKey="main" />;

  const setEnrollment = (e) => {
    e.preventDefault();
    setEnrollmentView(!openEnrollment);
  };
  const setViewAccessToggle = (e) => {
    e.preventDefault();
    if (filter === 'Released Only') {
      setFilteredDrive('Assigned Only');
    } else {
      setFilteredDrive('Released Only');
    }
  };
  const enrollDriveId = { driveId: routePathDriveId };
  let hideUnpublished = true;
  if (role === 'Instructor') {
    hideUnpublished = false;
  }
  let urlClickBehavior = '';
  if (role === 'Instructor') {
    urlClickBehavior = 'select';
  }


  const profile = useContext(ProfileContext);
  if (profile.signedIn === '0') {
    return (
      <>
        <GlobalFont />
        <Tool>
          <headerPanel title="Course"></headerPanel>

          <mainPanel>
            <div
              style={{
                border: '1px solid grey',
                borderRadius: '20px',
                margin: 'auto',
                marginTop: '10%',
                padding: '10px',
                width: '50%',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2>You are not signed in</h2>
                <h2>Course currently requires sign in for use</h2>
                <button style={{ background: '#1a5a99', borderRadius: '5px' }}>
                  <a
                    href="/signin"
                    style={{ color: 'white', textDecoration: 'none' }}
                  >
                    Sign in with this link
                  </a>
                </button>
              </div>
            </div>
          </mainPanel>
        </Tool>
      </>
    );
  }

  return (
    <>
      <URLPathSync route={props.route} />
      <GlobalFont />
      <Tool>
        <headerPanel title="Course" />
        <navPanel isInitOpen>
          <div
            style={{ marginBottom: '40px', height: '100vh' }}
            onClick={outsideDriveSelection}
          >
            <Drive
              driveId={routePathDriveId}
              foldersOnly={true}
              drivePathSyncKey="main"
            />
          </div>
        </navPanel>

        <mainPanel>
          <AutoSelect />
          {openEnrollment ? (
            <Enrollment selectedCourse={enrollDriveId} />
          ) : (
            <>
              {breadcrumbContainer}
              <div
                onClick={() => {
                  clearSelections();
                }}
                // className={routePathDriveId ? 'mainPanelStyle' : ''}
              >
                <Container>
                  <Drive
                    columnTypes={columnsArr}
                    driveId={routePathDriveId}
                    hideUnpublished={hideUnpublished}
                    subTypes={['Administrator']}
                    urlClickBehavior="select"
                    drivePathSyncKey="main"
                    doenetMLDoubleClickCallback={(info) => {
                      openOverlay({
                        type: 'content',
                        doenetId: info.item.doenetId,
                        title: info.item.label,
                      });
                    }}
                  />
                </Container>
              </div>

              <div onClick={cleardrivecardSelection} tabIndex={0}>
                {!routePathDriveId && <h2>Admin</h2>}
                <DriveCards
                  routePathDriveId={routePathDriveId}
                  isOneDriveSelect={true}
                  types={['course']}
                  drivePathSyncKey="main"
                  subTypes={['Administrator']}
                />

                {!routePathDriveId && <h2>Student</h2>}
                <DriveCards
                  isOneDriveSelect={true}
                  routePathDriveId={routePathDriveId}
                  isOneDriveSelect={true}
                  types={['course']}
                  drivePathSyncKey="main"
                  subTypes={['Student']}
                />
              </div>
            </>
          )}
        </mainPanel>
       
          
            {routePathDriveId && <menuPanel isInitOpen title="Assignment">
              <VersionInfo route={props.route} />
              <br />
              <ItemInfoPanel route={props.route} />
            </menuPanel>}

            { routePathDriveId && <menuPanel title="+Add">
              <>
                <Button
                  value={
                    openEnrollment ? 'Close Enrollment' : 'Open Enrollment'
                  }
                  callback={(e) => setEnrollment(e)}
                ></Button>
                <br />
                <label>View as Student</label>

                <Switch
                  onChange={(e) => setViewAccessToggle(e)}
                  checked={filter === 'Released Only' ? false : true}
                ></Switch>
              </>
            </menuPanel>}
          
        
      </Tool>
    </>
  );
}

const DoenetMLInfoPanel = (props) => {
  const {addContentAssignment,changeSettings,saveSettings,assignmentToContent,loadAvailableAssignment, publishContentAssignment,onAssignmentError,} = useAssignment();
  const {makeAssignment,onmakeAssignmentError,publishAssignment,onPublishAssignmentError,publishContent,onPublishContentError, updateAssignmentTitle,onUpdateAssignmentTitleError,convertAssignmentToContent,onConvertAssignmentToContentError} = useAssignmentCallbacks();
  const selectedVId = useRecoilValue(selectedVersionAtom);

  const itemInfo = props.contentInfo;
  const versionHistory = useRecoilValueLoadable(
    itemHistoryAtom(itemInfo.doenetId),
  );

  const selectedContentId = () => {
    const assignedArr = versionHistory.contents.named.filter(
      (item) => item.versionId === selectedVId,
    );
    if (assignedArr.length > 0) {
      return assignedArr[0].contentId;
    } else {
      return '';
    }
  };
  const assignmentInfoSettings = useRecoilValueLoadable(
    assignmentDictionarySelector({
      driveId: itemInfo.driveId,
      folderId: itemInfo.parentFolderId,
      itemId: itemInfo.itemId,
      doenetId: itemInfo.doenetId,
      versionId: selectedVId,
      contentId: selectedContentId(),
    }),
  );

  let aInfo = '';

  if (assignmentInfoSettings?.state === 'hasValue') {
    aInfo = assignmentInfoSettings?.contents;

    if (aInfo?.assignmentId) {
      assignmentId = aInfo?.assignmentId;
    }
  }

  let assignmentForm = null;

  const [addToast, ToastType] = useToast();

  const handleChange = (event) => {
    event.preventDefault();
    let name = event.target.name;
    let value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
        if (aInfo[`${name}`] != value) {
          const result = changeSettings({
            [name]: value,
            driveIditemIdbranchIdparentFolderId: {
              driveId: itemInfo.driveId,
              folderId: itemInfo.parentFolderId,
              itemId: itemInfo.itemId,
              branchId: itemInfo.branchId,
              versionId: selectedVId,
              contentId: selectedContentId(),
            },
          });

        }
  };
  const handleOnBlur = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      // console.log(">>>>>> aInfo", aInfo);
      // console.log(">>>>>> aInfo name", aInfo[`${name}`], value);
      const result = saveSettings({
      [name]: value,
      driveIditemIddoenetIdparentFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
        itemId: itemInfo.itemId,
        doenetId: itemInfo.doenetId,
        versionId: selectedVId,
        contentId: selectedContentId(),
      },
    });
    let payload = {
      ...aInfo,
      itemId: itemInfo.itemId,
      isAssigned: '1',
      [name]: value,
      doenetId: itemInfo.doenetId,
      contentId: itemInfo.contentId,
    };
    updateAssignmentTitle({
      driveIdFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
      },
      itemId: itemInfo.itemId,
      payloadAssignment: payload,
      doenetId: itemInfo.doenetId,
      contentId: itemInfo.contentId,
    });

        result
          .then((resp) => {
            if (resp.data.success) {
              addToast(`Updated '${name}' to '${value}'`, ToastType.SUCCESS);
            } else {
              onAssignmentError({ errorMessage: resp.data.message });
            }
          })
          .catch((e) => {
            onAssignmentError({ errorMessage: e.message });
          });
    
  };

  // // View Assignment Form
  const checkIsVersionAssigned = () => {
    const selectedVId = useRecoilValue(selectedVersionAtom);
    const assignedArr = props.versionArr.filter(
      (item) => item.versionId === selectedVId,
    );
    if (assignedArr.length > 0 && assignedArr[0].isAssigned == '1') {
      return true;
    } else {
      return false;
    }
  };

  if (itemInfo.isAssigned === '1') {
    assignmentForm = (
      <>
        {
          <>
            <h3>Assignment Info</h3>
            <div>
              <label>Assigned Date:</label>
              <input
                required
                type="text"
                name="assignedDate"
                value={aInfo ? aInfo?.assignedDate : ''}
                placeholder="0001-01-01 01:01:01 "
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Due date: </label>
              <input
                required
                type="text"
                name="dueDate"
                value={aInfo ? aInfo?.dueDate : ''}
                placeholder="0001-01-01 01:01:01"
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Time Limit:</label>
              <input
                required
                type="time"
                name="timeLimit"
                value={aInfo ? aInfo?.timeLimit : ''}
                placeholder="01:01:01"
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Number Of Attempts:</label>
              <Increment range={[0, 20]} />
              <input
                required
                type="number"
                name="numberOfAttemptsAllowed"
                value={aInfo ? aInfo?.numberOfAttemptsAllowed : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Attempt Aggregation :</label>
              <select name="attemptAggregation" onChange={handleOnBlur}>
                <option
                  value="m"
                  selected={aInfo?.attemptAggregation === 'm' ? 'selected' : ''}
                >
                  Maximum
                </option>
                <option
                  value="l"
                  selected={aInfo?.attemptAggregation === 'l' ? 'selected' : ''}
                >
                  Last Attempt
                </option>
              </select>
            </div>
            <div>
              <label>Total Points Or Percent: </label>
              <input
                required
                type="number"
                name="totalPointsOrPercent"
                value={aInfo ? aInfo?.totalPointsOrPercent : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Grade Category: </label>
              <input
                required
                type="select"
                name="gradeCategory"
                value={aInfo ? aInfo?.gradeCategory : ''}
                onBlur={handleOnBlur}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Individualize: </label>
              <Switch
                name="individualize"
                onChange={handleOnBlur}
                checked={aInfo ? aInfo?.individualize : false}
              ></Switch>
            </div>
            <div>
              <label>Multiple Attempts: </label>
              <Switch
              name="multipleAttempts"
                onChange={handleOnBlur}
                checked={aInfo ? aInfo?.multipleAttempts : false}
              ></Switch>
            </div>
            <div>
              <label>Show solution: </label>
              <Switch
              name="showSolution"
                onChange={handleOnBlur}
                checked={aInfo ? aInfo?.showSolution : false}
              ></Switch>
            </div>
            <div>
              <label>Show feedback: </label>
              <Switch
              name="showFeedback"
                onChange={handleOnBlur}
                checked={aInfo ? aInfo?.showFeedback : false}
              ></Switch>
            </div>
            <div>
              <label>Show hints: </label>
              <Switch
              name="showHints"
                onChange={handleOnBlur}
                checked={aInfo ? aInfo?.showHints : false}
              ></Switch>         
            </div>
            <div>
              <label>Show correctness: </label>
              <Switch
              name="showCorrectness"
                onChange={handleOnBlur}
                checked={aInfo ? aInfo?.showCorrectness : false}
              ></Switch> 
            </div>
            <div>
              <label>Proctor make available: </label>
              <Switch
              name="proctorMakesAvailable"
                onChange={handleOnBlur}
                checked={aInfo ? aInfo?.proctorMakesAvailable : false}
              ></Switch> 
            </div>
            <br />
          </>
        }
      </>
    );
  }

  return <>{assignmentForm}</>;
};
const FolderInfoPanel = () => {
  return <h1>Folder Info</h1>;
};
const VersionHistoryInfoPanel = (props) => {
  const [selectedVId, setSelectedVId] = useState();
  const setSelectedVersionAtom = useSetRecoilState(selectedVersionAtom);
  const itemInfo = props.contentInfo;
  const versionHistory = useRecoilValueLoadable(
    itemHistoryAtom(itemInfo.doenetId),
  );
  const selectedVersionId = useRecoilValue(versionHistoryReleasedSelectedAtom);
  const { openOverlay, activateMenuPanel } = useToolControlHelper();
  const {
    addContentAssignment,
    addSwitchAssignment,
    updateVersionHistory,
    updatePrevVersionHistory,
    changeSettings,
    saveSettings,
    assignmentToContent,
    onAssignmentError,
  } = useAssignment();
  const { makeAssignment, convertAssignmentToContent } =
    useAssignmentCallbacks();
  const [addToast, ToastType] = useToast();
  const [checkIsAssigned, setIsAssigned] = useState(false);
  const [selectVersion, setSelectVersion] = useState(false);

  const versionHistorySelected = useRecoilCallback(
    ({ snapshot, set }) =>
      async (version) => {
        set(versionHistoryReleasedSelectedAtom, version.versionId);
        let loadableDoenetML = await snapshot.getPromise(
          fileByContentId(version.contentId),
        );
        const doenetML = loadableDoenetML.data;
        set(viewerDoenetMLAtom, (was) => {
          let newObj = { ...was };
          newObj.doenetML = doenetML;
          newObj.updateNumber = was.updateNumber + 1;
          return newObj;
        });
      },
  );
  const selectedContentId = () => {
    const assignedArr = versionHistory.contents.named.filter(
      (item) => item.versionId === selectedVId,
    );
    if (assignedArr.length > 0) {
      return assignedArr[0].contentId;
    } else {
      return '';
    }
  };
  let aInfo = '';
  const assignmentInfoSettings = useRecoilValueLoadable(
    loadAssignmentSelector(itemInfo.doenetId),
  );
  if (assignmentInfoSettings?.state === 'hasValue') {
    aInfo = assignmentInfoSettings?.contents?.assignments[0];

  }

  if (versionHistory.state === 'loading') {
    return null;
  }
  if (versionHistory.state === 'hasError') {
    console.error(versionHistory.contents);
    return null;
  }

  let assignVersions = [];
  let makeAssignmentforReleasedButton = null;
  let unAssignButton = null;
  let viewContentButton = null;
  let releasedVersions = [];
  let switchAssignmentButton = null;
  if (versionHistory.state === 'hasValue') {
    for (let version of versionHistory.contents.named) {
      let titleText = version.title;
      let versionStyle = {};
      if (selectVersion) {
        versionStyle = { backgroundColor: '#b8d2ea' };

        makeAssignmentforReleasedButton = (
          <>
            <Button
              value="Make Assignment"
              callback={async () => {
                setIsAssigned(true);
                const result = await addContentAssignment({
                  driveIditemIddoenetIdparentFolderId: {
                    driveId: itemInfo.driveId,
                    folderId: itemInfo.parentFolderId,
                    itemId: itemInfo.itemId,
                    doenetId: itemInfo.doenetId,
                    contentId: selectedContentId(),
                    versionId: selectedVId,
                  },
                  doenetId: itemInfo.doenetId,
                  contentId: selectedContentId(),
                  versionId: selectedVId,
                });
                let payload = {
                  ...aInfo,
                  itemId: itemInfo.itemId,
                  isAssigned: '1',
                  doenetId: itemInfo.doenetId,
                  contentId: selectedContentId(),
                  driveId: itemInfo.driveId,
                  versionId: selectedVId,
                };

                makeAssignment({
                  driveIdFolderId: {
                    driveId: itemInfo.driveId,
                    folderId: itemInfo.parentFolderId,
                  },
                  itemId: itemInfo.itemId,
                  payload: payload,
                });
                updateVersionHistory(itemInfo.doenetId, selectedVId);
                try {
                  if (result.success) {
                    addToast(
                      `Add new assignment`,
                      ToastType.SUCCESS,
                    );
                  } else {
                    onAssignmentError({ errorMessage: result.message });
                  }
                } catch (e) {
                  onAssignmentError({ errorMessage: e });
                }
              }}
            />
            <br />
          </>
        );
        unAssignButton = (
          <>
            <Button
              value="Unassign"
              callback={async () => {
                assignmentToContent({
                  driveIditemIddoenetIdparentFolderId: {
                    driveId: itemInfo.driveId,
                    folderId: itemInfo.parentFolderId,
                    itemId: itemInfo.itemId,
                    doenetId: itemInfo.doenetId,
                    contentId: selectedContentId(),
                    versionId: selectedVId,
                  },
                  doenetId: itemInfo.doenetId,
                  contentId: version?.contentId,
                  versionId: version?.versionId,
                });

                convertAssignmentToContent({
                  driveIdFolderId: {
                    driveId: itemInfo.driveId,
                    folderId: itemInfo.parentFolderId,
                  },
                  itemId: itemInfo.itemId,
                  doenetId: itemInfo.doenetId,
                  contentId: version?.contentId,
                  versionId: version?.versionId,
                });

                const result = axios.post(`/api/handleMakeContent.php`, {
                  contentId: version?.contentId,
                  versionId: version?.versionId,
                  itemId: itemInfo.itemId,
                  doenetId: itemInfo.doenetId,
                });
                result
                  .then((resp) => {
                    if (resp.data.success) {
                      addToast(
                        `'UnAssigned ${itemInfo.label}''`, 
                        ToastType.SUCCESS,
                      );
                    } else {
                      onAssignmentError({ errorMessage: resp.data.message });
                    }
                  })
                  .catch((e) => {
                    onAssignmentError({ errorMessage: e.message });
                  });
              }}
            />
            <br />
            <br />
          </>
        );
        viewContentButton = (
          <>
            <Button
              value="View Version"
              callback={() => {
                openOverlay({
                  type: 'content',
                  doenetId: itemInfo?.doenetId,
                  // contentId: itemInfo?.contentId,
                });
              }}
            />
          </>
        );
        switchAssignmentButton = (
          <>
            <Button
              value="Switch Assignment"
              callback={async () => {
                setIsAssigned(true);
                const result = await addSwitchAssignment({
                  driveIditemIddoenetIdparentFolderId: {
                    driveId: itemInfo.driveId,
                    folderId: itemInfo.parentFolderId,
                    itemId: itemInfo.itemId,
                    doenetId: itemInfo.doenetId,
                    contentId: selectedContentId(),
                    versionId: selectedVId,
                  },
                  doenetId: itemInfo.doenetId,
                  contentId: selectedContentId(),
                  versionId: selectedVId,
                  ...aInfo
                });
                let payload = {
                  ...aInfo,
                  itemId: itemInfo.itemId,
                  isAssigned: '1',
                  doenetId: itemInfo.doenetId,
                  contentId: selectedContentId(),
                  driveId: itemInfo.driveId,
                  versionId: selectedVId,
                };

                makeAssignment({
                  driveIdFolderId: {
                    driveId: itemInfo.driveId,
                    folderId: itemInfo.parentFolderId,
                  },
                  itemId: itemInfo.itemId,
                  payload: payload,
                });
                updateVersionHistory(itemInfo.doenetId, selectedVId);
                updatePrevVersionHistory(
                  itemInfo.doenetId,
                  prevAssignedVersionId(),
                );
                try {
                  if (result.success) {
                    addToast(
                      `Switch  assignment`,
                      ToastType.SUCCESS,
                    );
                  } else {
                    onAssignmentError({ errorMessage: result.message });
                  }
                } catch (e) {
                  onAssignmentError({ errorMessage: e });
                }
              }}
            />
          </>
        );
      }
      let assignedTitle = '';
      let assignedIcon = '';

      if (version.isReleased === '1') {
        assignedTitle = titleText;
      } else if (version.isReleased === '1' && version?.isAssigned == '1') {
        assignedTitle = `${assignedIcon} ${titleText}`;
      }
      releasedVersions = (
        <React.Fragment key={`history${version.versionId}`}>
          <div
            onClick={() => {
              if (version.versionId !== selectedVersionId) {
                versionHistorySelected(version);
              }
            }}
            style={versionStyle}
          >
            <div>{version.title}</div>
          </div>
        </React.Fragment>
      );
      //TODO do we need draft or only released or latest released
      if (version.isReleased === '1') {
        assignVersions.push(releasedVersions);
      }
    }
  }

  const selectedVersion = (item) => {
    setSelectVersion(true);
    setSelectedVId(item);
    setSelectedVersionAtom(item);
  };

  const checkIfAssigned = (item) => {
    const assignedArr = versionHistory.contents.named.filter(
      (item) => item.versionId === selectedVId,
    );
    if (assignedArr.length > 0 && assignedArr[0].isAssigned == '1') {
      return true;
    } else {
      return false;
    }
  };

  const checkAssignArrItemAssigned = (item) => {
    const assignedArr = versionHistory.contents.named.filter(
      (item) => item.isAssigned == '1',
    );
    if (assignedArr.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const prevAssignedVersionId = () => {
    const assignedArr = versionHistory.contents.named.filter(
      (item) => item.isAssigned == '1',
    );
    if (assignedArr.length > 0) {
      return assignedArr[0].versionId;
    } else {
      return '';
    }
  };

  let assigned = (
    <select multiple onChange={(event) => selectedVersion(event.target.value)}>
      {versionHistory.contents.named.map((item, i) => (
        <>
          {item.isReleased == 1 ? (
            <option key={i} value={item.versionId}>
              {item.isAssigned == 1 ? '(Assigned)' : ''}
              {item.title}
            </option>
          ) : (
            ''
          )}
        </>
      ))}
    </select>
  );

  return (
    <>
      {assigned}

      <br />
      <br />
      {itemInfo.isAssigned !== '1' && makeAssignmentforReleasedButton}
      {itemInfo.isAssigned == '1' && checkIfAssigned() && unAssignButton}
      {itemInfo.isAssigned == '1' &&
        checkAssignArrItemAssigned() &&
        !checkIfAssigned() &&
        switchAssignmentButton}
    </>
  );
};

const ItemInfoPanel = (props) => {
  let versionArr = [];
  const contentInfoLoad = useRecoilValueLoadable(selectedInformation);
  const versionHistory = useRecoilValueLoadable(
    itemHistoryAtom(contentInfoLoad?.contents?.itemInfo?.doenetId),
  );

  if (versionHistory.state === 'loading') {
    return null;
  }
  if (versionHistory.state === 'hasError') {
    console.error(versionHistory.contents);
    return null;
  }
  if (versionHistory.state === 'hasValue') {
    versionArr = versionHistory?.contents?.named;
  }
  if (contentInfoLoad.state === 'loading') {
    return null;
  }
  if (contentInfoLoad.state === 'hasError') {
    console.error(contentInfoLoad.contents);
    return null;
  }
  let contentInfo = contentInfoLoad?.contents?.itemInfo;

  if (contentInfoLoad.contents?.number > 1) {
    return (
      <>
        <h1>{contentInfoLoad.contents.number} Content Selected</h1>
      </>
    );
  } else if (contentInfoLoad.contents?.number === 1) {
    if (contentInfo?.itemType === 'DoenetML') {
      return (
        <DoenetMLInfoPanel
          key={`DoenetMLInfoPanel${contentInfo.itemId}`}
          contentInfo={contentInfo}
          props={props}
          versionArr={versionArr}
        />
      );
    } else if (contentInfo?.itemType === 'Folder') {
      return (
        <FolderInfoPanel
          key={`FolderInfoPanel${contentInfo.itemId}`}
          contentInfo={contentInfo}
        />
      );
    }
  }
  return null;
};
const VersionInfo = (props) => {
  const contentInfoLoad = useRecoilValueLoadable(selectedInformation);
  if (contentInfoLoad.state === 'loading') {
    return null;
  }
  if (contentInfoLoad.state === 'hasError') {
    console.error(contentInfoLoad.contents);
    return null;
  }
  let contentInfo = contentInfoLoad?.contents?.itemInfo;

  if (contentInfoLoad.contents?.number > 1) {
    return (
      <>
        <h1>{contentInfoLoad.contents.number} Content Selected</h1>
      </>
    );
  } else if (contentInfoLoad.contents?.number === 1) {
    if (contentInfo?.itemType === 'DoenetML') {
      return (
        <VersionHistoryInfoPanel
          key={`VersionHistoryInfoPanel${contentInfo.itemId}`}
          contentInfo={contentInfo}
          props={props}
        />
      );
    }
  }
  return null;
};

//Student view info panel

// <div>
//       {
//         itemInfo.assignment_isPublished ===
//           '1'(
//             <div>
//               <p>Due: {aInfo?.dueDate}</p>
//               <p>Time Limit: {aInfo?.timeLimit}</p>
//               <p>
//                 Number of Attempts Allowed: {aInfo?.numberOfAttemptsAllowed}
//               </p>
//               <p>Points: {aInfo?.totalPointsOrPercent}</p>
//             </div>,
//           )}
//     </div>
