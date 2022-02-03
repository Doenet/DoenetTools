import React, { useState, lazy, Suspense, useRef } from 'react';
import {
  atom,
  selector,
  useRecoilValue,
  atomFamily,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import styled from 'styled-components';
import Toast from './Toast';
import ContentPanel from './Panels/NewContentPanel';
import axios from 'axios';
// import { GlobalStyle } from "../../Tools/DoenetStyle";
import MainPanel from './Panels/NewMainPanel';
import SupportPanel from './Panels/NewSupportPanel';
import MenuPanel from './Panels/NewMenuPanel';
import FooterPanel from './Panels/FooterPanel';
import { animated } from '@react-spring/web';

import { useHistory, useLocation } from 'react-router';

const ToolContainer = styled(animated.div)`
  display: grid;
  grid-template:
    'menuPanel contentPanel ' 1fr
    'menuPanel footerPanel ' auto
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  background-color: #e2e2e2;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0px;
  gap: 0px;
  box-sizing: border-box;
`;

export const profileAtom = atom({
  key: 'profileAtom',
  default: selector({
    key: 'profileAtom/Default',
    get: async () => {
      try {
        // const profile = JSON.parse(localStorage.getItem('Profile'));
        // if (profile){
        //   return profile;
        // }
        //It wasn't stored in local storage so load it from server
        const { data } = await axios.get('/api/loadProfile.php');
        // localStorage.setItem('Profile', JSON.stringify(data.profile));
        return data.profile;
      } catch (error) {
        console.log('Error loading user profile', error.message);
        return {};
      }
    },
  }),
});

export const searchParamAtomFamily = atomFamily({
  key: 'searchParamAtomFamily',
  default: '',
});

export const paramObjAtom = atom({
  key: 'paramObjAtom',
  default: {},
});

//height: 120
//open: true
//component: "mathKeyboard"
export const footerAtom = atom({
  key: 'footerAtom',
  default: null,
});

// **** ToolRoot ****
//Keep  as simple as we can
//Keep refreshes to a minimum
//Don't use recoil in ToolRoot

export default function ToolRoot() {
  console.log('>>>===ToolRoot ');

  let footerObj = useRecoilValue(footerAtom);

  const [toolRootMenusAndPanels, setToolRootMenusAndPanels] = useState({
    pageName: 'init',
    menuPanelCap: '',
    currentMenus: [],
    menusTitles: [],
    menusInitOpen: [],
    currentMainPanel: 'Empty',
    supportPanelOptions: [],
    supportPanelTitles: [],
    supportPanelIndex: 0,
    hasNoMenuPanel: false,
    headerControls: [],
    displaySettings: true,
  });
  let mainPanel = null;
  let supportPanel = <SupportPanel hide={true}>null</SupportPanel>;

  const [menusOpen, setMenusOpen] = useState(true);

  const LazyPanelObj = useRef({
    Empty: lazy(() => import('./ToolPanels/Empty')),
    NotFound: lazy(() => import('./ToolPanels/NotFound')),
    AccountSettings: lazy(() => import('./ToolPanels/AccountSettings')),
    HomePanel: lazy(() => import('./ToolPanels/HomePanel')),
    Content: lazy(() => import('./ToolPanels/Content')),
    DriveCards: lazy(() => import('./ToolPanels/DriveCards')),
    SignIn: lazy(() => import('./ToolPanels/SignIn')),
    SignOut: lazy(() => import('./ToolPanels/SignOut')),
    NavigationPanel: lazy(() => import('./ToolPanels/NavigationPanel')),
    Dashboard: lazy(() => import('./ToolPanels/Dashboard')),
    Gradebook: lazy(() => import('./ToolPanels/Gradebook')),
    GradebookAssignment: lazy(() => import('./ToolPanels/GradebookAssignment')),
    GradebookStudent: lazy(() => import('./ToolPanels/GradebookStudent')),
    GradebookStudentAssignment: lazy(() =>
      import('./ToolPanels/GradebookStudentAssignment'),
    ),
    GradebookAttempt: lazy(() => import('./ToolPanels/GradebookAttempt')),
    EditorViewer: lazy(() => import('./ToolPanels/EditorViewer')),
    AssignmentViewer: lazy(() => import('./ToolPanels/AssignmentViewer')),
    SurveyListViewer: lazy(() => import('./ToolPanels/SurveyListViewer')),
    SurveyDataViewer: lazy(() => import('./ToolPanels/SurveyDataViewer')),
    DoenetMLEditor: lazy(() => import('./ToolPanels/DoenetMLEditor')),
    Enrollment: lazy(() => import('./ToolPanels/Enrollment')),
    CollectionEditor: lazy(() => import('./ToolPanels/CollectionEditor')),
    ChooseLearnerPanel: lazy(() => import('./ToolPanels/ChooseLearnerPanel')),
    EndExamPanel: lazy(() => import('./ToolPanels/EndExamPanel')),
  }).current;

  const LazyControlObj = useRef({
    BackButton: lazy(() => import('./HeaderControls/BackButton')),
    ViewerUpdateButton: lazy(() =>
      import('./HeaderControls/ViewerUpdateButton'),
    ),
    NavigationBreadCrumb: lazy(() =>
      import('./HeaderControls/NavigationBreadCrumb'),
    ),
    CollectionBreadCrumb: lazy(() =>
      import('./HeaderControls/CollectionBreadCrumb'),
    ),
    ChooserBreadCrumb: lazy(() => import('./HeaderControls/ChooserBreadCrumb')),
    DashboardBreadCrumb: lazy(() =>
      import('./HeaderControls/DashboardBreadCrumb'),
    ),
    EnrollmentBreadCrumb: lazy(() =>
      import('./HeaderControls/EnrollmentBreadCrumb'),
    ),
    SurveyBreadCrumb: lazy(() => import('./HeaderControls/SurveyBreadCrumb')),
    EditorBreadCrumb: lazy(() => import('./HeaderControls/EditorBreadCrumb')),
    GradebookBreadCrumb: lazy(() =>
      import('./HeaderControls/GradebookBreadCrumb'),
    ),
    AssignmentBreadCrumb: lazy(() =>
      import('./HeaderControls/AssignmentBreadCrumb'),
    ),
    AssignmentNewAttempt: lazy(() =>
      import('./HeaderControls/AssignmentNewAttempt'),
    ),
  }).current;

  const LazyFooterObj = useRef({
    MathInputKeyboard: lazy(() => import('./Footers/MathInputKeyboard')),
  }).current;

  let MainPanelKey = `${toolRootMenusAndPanels.pageName}-${toolRootMenusAndPanels.currentMainPanel}`;

  mainPanel = (
    <Suspense
      key={MainPanelKey}
      fallback={<LoadingFallback>loading...</LoadingFallback>}
    >
      {React.createElement(
        LazyPanelObj[toolRootMenusAndPanels.currentMainPanel],
        { MainPanelKey },
      )}
    </Suspense>
  );

  if (
    toolRootMenusAndPanels?.supportPanelOptions &&
    toolRootMenusAndPanels?.supportPanelOptions.length > 0
  ) {
    const spType =
      toolRootMenusAndPanels.supportPanelOptions[
        toolRootMenusAndPanels.supportPanelIndex
      ];
    const SupportPanelKey = `${toolRootMenusAndPanels.pageName}-${
      toolRootMenusAndPanels.supportPanelOptions[
        toolRootMenusAndPanels.supportPanelIndex
      ]
    }-${toolRootMenusAndPanels.supportPanelIndex}`;
    supportPanel = (
      <SupportPanel
        hide={false}
        panelTitles={toolRootMenusAndPanels.supportPanelTitles}
        panelIndex={toolRootMenusAndPanels.supportPanelIndex}
      >
        <Suspense
          key={SupportPanelKey}
          fallback={<LoadingFallback>loading...</LoadingFallback>}
        >
          {React.createElement(LazyPanelObj[spType], { SupportPanelKey })}
        </Suspense>
      </SupportPanel>
    );
  }

  let headerControls = null;
  if (toolRootMenusAndPanels.headerControls) {
    headerControls = [];
    for (const [i, controlName] of Object.entries(
      toolRootMenusAndPanels.headerControls,
    )) {
      const controlObj = LazyControlObj[controlName];
      if (controlObj) {
        const key = `headerControls${MainPanelKey}`;
        headerControls.push(
          <Suspense
            key={key}
            fallback={<LoadingFallback>loading...</LoadingFallback>}
          >
            {React.createElement(controlObj, { key: { key } })}
          </Suspense>,
        );
      }
    }
  }
   

  let menus = <MenuPanel key='menuPanel' hide={true} />;
  if (menusOpen && !toolRootMenusAndPanels.hasNoMenuPanel){
    menus = <MenuPanel 
    key='menuPanel' 
    hide={false} 
    setMenusOpen={setMenusOpen} 
    menusOpen={menusOpen} 
    menuPanelCap={toolRootMenusAndPanels.menuPanelCap}
    menusTitles={toolRootMenusAndPanels.menusTitles} 
    currentMenus={toolRootMenusAndPanels.currentMenus} 
    initOpen={toolRootMenusAndPanels.menusInitOpen}
    displaySettings={toolRootMenusAndPanels.displaySettings}
    />
  }

  //If no menu panel then don't show open menu button
  let openMenuButton = !menusOpen;
  if (toolRootMenusAndPanels.hasNoMenuPanel) {
    openMenuButton = false;
  }

  //MathInputKeyboard
  let footer = null;

  //Todo: Why is this null?
  console.log("footerObj",footerObj)
  if (footerObj) {
    let footerKey = `footer`;
    footer = (
      <FooterPanel
        id="keyboard"
        isInitOpen={footerObj.open}
        height={footerObj.height}
      >
        <Suspense
          key={footerKey}
          fallback={<LoadingFallback>loading...</LoadingFallback>}
        >
          {React.createElement(LazyFooterObj[footerObj.component], {
            key: { footerKey },
          })}
        </Suspense>
      </FooterPanel>
    );
  }

  // <p>insert keyboard here</p></FooterPanel>

  return (
    <>
      <ToolContainer>
        {menus}
        <ContentPanel
          main={
            <MainPanel
              headerControls={headerControls}
              setMenusOpen={setMenusOpen}
              openMenuButton={openMenuButton}
              displaySettings={toolRootMenusAndPanels.displaySettings}
            >
              {mainPanel}
            </MainPanel>
          }
          support={supportPanel}
        />
        {footer}
      </ToolContainer>
      <Toast />

      <MemoizedRootController
        key="root_controller"
        setToolRootMenusAndPanels={setToolRootMenusAndPanels}
      />
      <MemoizedOnLeave key="MemoizedOnLeave" />
    </>
  );
}

// These are the navigationObj options
// currentMenus:[],
// menusTitles:[],
// menusInitOpen:[],
// currentMainPanel:"",
// supportPanelOptions:[],
// supportPanelTitles:[],
// supportPanelIndex:0,
// hasNoMenuPanel: true,
// headerControls:["BackButton"],
// hasNoMenuPanel: true,
// waitForMenuSuppression:true,

let navigationObj = {
  content: {
    default: {
      pageName: 'Content',
      currentMenus: [],
      menusTitles: [],
      menusInitOpen: [],
      currentMainPanel: 'Content',
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      hasNoMenuPanel: true,
    },
  },
  exam: {
    default: {
      defaultTool: 'chooseLearner',
    },
    chooseLearner: {
      pageName: 'chooseLearner',
      currentMainPanel: 'ChooseLearnerPanel',
      displaySettings: false,
    },
    assessment: {
      pageName: 'Assessment',
      menuPanelCap: 'AssignmentInfoCap',
      currentMainPanel: 'AssignmentViewer',
      currentMenus: ['TimerMenu'],
      menusTitles: ['Time Remaining'],
      menusInitOpen: [true],
      headerControls: [],
      displaySettings: false,
      waitForMenuSuppression: true,
    },
    endExam: {
      pageName: 'endExam',
      currentMainPanel: 'EndExamPanel',
      displaySettings: false,
      hasNoMenuPanel: true,
    },
  },
  course: {
    default: {
      defaultTool: 'courseChooser',
    },
    assignment: {
      pageName: 'Assignment',
      menuPanelCap: 'AssignmentInfoCap',
      currentMainPanel: 'AssignmentViewer',
      currentMenus: ['CreditAchieved', 'TimerMenu'],
      menusTitles: ['Credit Achieved', 'Time Remaining'],
      menusInitOpen: [true, true],
      headerControls: ['AssignmentBreadCrumb', 'AssignmentNewAttempt'],
      waitForMenuSuppression: true,
    },
    courseChooser: {
      //allCourses
      pageName: 'Course',
      currentMainPanel: 'DriveCards',
      currentMenus: ['CreateCourse'],
      menusTitles: ['Create Course'],
      menusInitOpen: [true],
      headerControls: ['ChooserBreadCrumb'],
      onLeave: 'CourseChooserLeave',
    },
    dashboard: {
      pageName: 'Dashboards',
      currentMainPanel: 'Dashboard',
      menuPanelCap: 'DriveInfoCap',
      currentMenus: ['ClassTimes', 'CurrentContent'],
      menusTitles: ['Class Times', 'Current Content'],
      menusInitOpen: [false, false],
      headerControls: ['DashboardBreadCrumb'],
      onLeave: 'DashboardLeave',
      waitForMenuSuppression: true,
    },
    gradebook: {
      pageName: 'Gradebook',
      currentMainPanel: 'Gradebook',
      menuPanelCap: 'DriveInfoCap',
      currentMenus: ['GradeDownload'],
      menusTitles: ['Download'],
      menusInitOpen: [false],
      headerControls: ['GradebookBreadCrumb'],
      waitForMenuSuppression: true,
      // onLeave:"",
    },
    gradebookAssignment: {
      pageName: 'Gradebook',
      currentMainPanel: 'GradebookAssignment',
      currentMenus: ['GradeUpload'],
      menusTitles: ['Upload'],
      menusInitOpen: [false],
      menuPanelCap: 'DriveInfoCap',
      headerControls: ['GradebookBreadCrumb'],
      waitForMenuSuppression: true,
      onLeave: 'GradebookAssignmentLeave',
    },
    gradebookStudent: {
      pageName: 'Gradebook',
      currentMainPanel: 'GradebookStudent',
      currentMenus: [],
      menuPanelCap: 'DriveInfoCap',
      menusTitles: [],
      menusInitOpen: [],
      headerControls: ['GradebookBreadCrumb'],
      // onLeave:"",
    },
    gradebookStudentAssignment: {
      pageName: 'Gradebook',
      currentMainPanel: 'GradebookStudentAssignment',
      menuPanelCap: 'DriveInfoCap',
      currentMenus: ['CreditAchieved', 'GradeSettings'],
      menusTitles: ['Credit Achieved', 'Settings'],
      menusInitOpen: [true, false],
      headerControls: ['GradebookBreadCrumb'],
      waitForMenuSuppression: true,
      // onLeave:"",
    },
    // gradebookAttempt: {
    //   pageName: "Gradebook",
    //   currentMainPanel: "GradebookAttempt",
    //   currentMenus:[],
    //   menuPanelCap:"DriveInfoCap",
    //   menusTitles:[],
    //   menusInitOpen:[],
    //   headerControls: ["GradebookBreadCrumb"],
    //   // onLeave:"",
    // },
    navigation: {
      //allFilesInCourse
      pageName: 'Course',
      currentMainPanel: 'NavigationPanel',
      menuPanelCap: 'DriveInfoCap',
      currentMenus: ['AddDriveItems'],
      menusTitles: ['Add Items'],
      menusInitOpen: [true],
      headerControls: ['NavigationBreadCrumb'],
      onLeave: 'NavigationLeave',
      waitForMenuSuppression: true,
    },
    editor: {
      //singleFile
      pageName: 'Course',
      menuPanelCap: 'EditorInfoCap',
      currentMainPanel: 'EditorViewer',
      currentMenus: ['VersionHistory', 'Variant', 'AssignmentSettingsMenu','SupportingFilesMenu'],
      menusTitles: ['Version History', 'Variant', 'Assignment Settings','Supporting Files'],
      menusInitOpen: [false, false, false],
      supportPanelOptions: ['DoenetMLEditor'],
      supportPanelTitles: ['DoenetML Editor'],
      supportPanelIndex: 0,
      headerControls: ['EditorBreadCrumb', 'ViewerUpdateButton'],
      onLeave: 'EditorLeave',
    },
    collection: {
      currentMainPanel: 'CollectionEditor',
      headerControls: ['CollectionBreadCrumb'],
      currentMenus: ['AssignmentSettingsMenu', 'GroupSettings'],
      menusTitles: ['Assignment Settings', 'Group Settings'],
      menusInitOpen: [false, false],
    },
    enrollment: {
      //allStudentsInCourse
      pageName: 'Enrollment',
      menuPanelCap: 'DriveInfoCap',
      // currentMenus:["LoadEnrollment","ManualEnrollment"],
      // menusTitles:["Load","Manual"],
      // menusInitOpen:[false,false],
      currentMenus: ['LoadEnrollment'],
      menusTitles: ['Import Learners'],
      menusInitOpen: [false],
      currentMainPanel: 'Enrollment',
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      headerControls: ['EnrollmentBreadCrumb'],
      // headerControls: ["BackButton"],
    },
    surveyList: {
      pageName: 'surveyList',
      menuPanelCap: 'DriveInfoCap',
      currentMainPanel: 'SurveyListViewer',
      headerControls: ['SurveyBreadCrumb'],
    },
    surveyData: {
      pageName: 'surveyData',
      menuPanelCap: 'DriveInfoCap',
      currentMainPanel: 'SurveyDataViewer',
      headerControls: ['SurveyBreadCrumb'],
    },
  },
  home: {
    default: {
      pageName: 'Home',
      currentMenus: [],
      menusTitles: [],
      menusInitOpen: [],
      currentMainPanel: 'HomePanel',
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      hasNoMenuPanel: true,
      displaySettings:false
    },
  },
  notfound: {
    default: {
      pageName: 'Notfound',
      currentMenus: [],
      menusInitOpen: [],
      currentMainPanel: 'NotFound',
      supportPanelOptions: [],
      hasNoMenuPanel: true,
    },
  },
  settings: {
    default: {
      pageName: 'Settings',
      currentMenus: [],
      menusTitles: [],
      menusInitOpen: [],
      currentMainPanel: 'AccountSettings',
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      hasNoMenuPanel: true,
      headerControls: ['BackButton'],
      displaySettings: false,
    },
  },
  signin: {
    default: {
      pageName: 'SignIn',
      currentMenus: [],
      menusTitles: [],
      menusInitOpen: [],
      currentMainPanel: 'SignIn',
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      hasNoMenuPanel: true,
      displaySettings: false,
    },
  },
  signout: {
    default: {
      pageName: 'SignOut',
      currentMenus: [],
      menusTitles: [],
      menusInitOpen: [],
      currentMainPanel: 'SignOut',
      supportPanelOptions: [],
      supportPanelTitles: [],
      supportPanelIndex: 0,
      hasNoMenuPanel: true,
      displaySettings: false,
    },
  },
};

let encodeParams = (p) =>
  Object.entries(p)
    .map((kv) => kv.map(encodeURIComponent).join('='))
    .join('&');

export const pageToolViewAtom = atom({
  key: 'pageToolViewAtom',
  default: { page: 'init', tool: '', view: '' },
});

const onLeaveComponentStr = atom({
  key: 'onLeaveComponentStr',
  default: { str: null, updateNum: 0 },
});

export const finishedOnLeave = atom({
  key: 'finishedOnLeave',
  default: null,
});

const MemoizedOnLeave = React.memo(OnLeave);
function OnLeave() {
  const leaveComponentObj = useRecoilValue(onLeaveComponentStr);
  const leaveComponentStr = leaveComponentObj.str;
  //TODO: make a queue of onLeaveStrings.  Remove from queue after component has finished.
  let leaveComponent = null;

  const LazyEnterLeaveObj = useRef({
    NavigationLeave: lazy(() => import('./EnterLeave/NavigationLeave')),
    EditorLeave: lazy(() => import('./EnterLeave/EditorLeave')),
    CourseChooserLeave: lazy(() => import('./EnterLeave/CourseChooserLeave')),
    DashboardLeave: lazy(() => import('./EnterLeave/DashboardLeave')),
    GradebookAssignmentLeave: lazy(() =>
      import('./EnterLeave/GradebookAssignmentLeave'),
    ),
  }).current;

  if (leaveComponentStr) {
    const key = `leave${leaveComponentStr}`;
    leaveComponent = (
      <Suspense key={key} fallback={null}>
        {/* {React.createElement(LazyEnterLeaveObj[leaveComponentName.current],{key})} */}
        {React.createElement(LazyEnterLeaveObj[leaveComponentStr])}
      </Suspense>
    );
  }

  return <>{leaveComponent}</>;
}

//Starts as null so we can detect empty array as an update
export const suppressMenusAtom = atom({
  key: 'suppressMenusAtom',
  default: null,
});

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const MemoizedRootController = React.memo(RootController);
function RootController(props) {
  const [recoilPageToolView, setRecoilPageToolView] =
    useRecoilState(pageToolViewAtom);
  const setOnLeaveStr = useSetRecoilState(onLeaveComponentStr);
  const [suppressMenus, setSuppressMenus] = useRecoilState(suppressMenusAtom);

  let lastPageToolView = useRef({ page: 'init', tool: '', view: '' });
  let backPageToolView = useRef({ page: 'init', tool: '', view: '' });
  let backParams = useRef({});
  let currentParams = useRef({});
  let lastLocationStr = useRef('');
  let location = useLocation();
  let history = useHistory();
  let lastSearchObj = useRef({});

  const setSearchParamAtom = useRecoilCallback(({ set }) => (paramObj) => {
    //Only set atom if parameter has changed
    for (const [key, value] of Object.entries(paramObj)) {
      if (lastSearchObj.current[key] !== value) {
        // console.log(`>>>>CHANGED key '${key}' value '${value}'`)
        set(searchParamAtomFamily(key), value);
      }
    }
    //If not defined then clear atom
    for (const key of Object.keys(lastSearchObj.current)) {
      if (!paramObj[key]) {
        // console.log(`>>>>clear!!! key '${key}' **********`)
        set(searchParamAtomFamily(key), '');
      }
    }
  });

  // let enterComponent = null; //Lazy loaded entering component
  let leaveComponentName = useRef(null);
  let lastSuppressMenu = useRef([]);
  let locationStr = `${location.pathname}${location.search}`;
  let nextPageToolView = { page: '', tool: '', view: '' };
  let nextMenusAndPanels = null;
  // console.log("\n>>>===RootController")

  //Suppress Menu change test
  let isSuppressMenuChange = !arraysEqual(
    suppressMenus,
    lastSuppressMenu.current,
  );
  lastSuppressMenu.current = suppressMenus;

  //Suppression
  if (isSuppressMenuChange && suppressMenus !== null) {
    nextMenusAndPanels = {
      ...navigationObj[recoilPageToolView.page][recoilPageToolView.tool],
    };
    nextMenusAndPanels.currentMenus = [
      ...navigationObj[recoilPageToolView.page][recoilPageToolView.tool]
        .currentMenus,
    ];
    nextMenusAndPanels.menusTitles = [
      ...navigationObj[recoilPageToolView.page][recoilPageToolView.tool]
        .menusTitles,
    ];
    nextMenusAndPanels.menusInitOpen = [
      ...navigationObj[recoilPageToolView.page][recoilPageToolView.tool]
        .menusInitOpen,
    ];

    if (suppressMenus.length > 0) {
      for (let suppressMenu of suppressMenus) {
        for (let [i, menu] of Object.entries(nextMenusAndPanels.currentMenus)) {
          if (menu === suppressMenu) {
            nextMenusAndPanels.currentMenus.splice(i, 1);
            nextMenusAndPanels.menusTitles.splice(i, 1);
            nextMenusAndPanels.menusInitOpen.splice(i, 1);
          }
        }
      }
    }
    props.setToolRootMenusAndPanels(nextMenusAndPanels);
    return null;
  }

  //URL change test
  let isURLChange = false;
  if (locationStr !== lastLocationStr.current) {
    isURLChange = true;
    nextPageToolView.page = location.pathname.replaceAll('/', '').toLowerCase();
    if (nextPageToolView.page === '') {
      nextPageToolView.page = 'home';
      const url = window.location.origin + window.location.pathname + '#home';
      //update url without pushing on to history
      window.history.replaceState('', '', url);
    }
    let searchParamObj = Object.fromEntries(
      new URLSearchParams(location.search),
    );
    nextPageToolView.tool = searchParamObj['tool'];
    if (!nextPageToolView.tool) {
      //Check for a page's default tool
      nextPageToolView.tool = '';
    }
  }

  //Recoil change test
  let isRecoilChange = false;
  if (
    JSON.stringify(lastPageToolView.current) !==
    JSON.stringify(recoilPageToolView)
  ) {
    isRecoilChange = true;
    if (recoilPageToolView.back) {
      if (backPageToolView.current.page === 'init') {
        backPageToolView.current.page = 'home'; //Go home if started with the page
      }
      let pageToolViewParams = {
        ...backPageToolView.current,
        params: backParams.current,
      };

      setRecoilPageToolView(pageToolViewParams);
      return null;
    }
    nextPageToolView = { ...recoilPageToolView };
  }

  if (!isURLChange && !isRecoilChange) {
    //Just updating tracking variables
    lastLocationStr.current = locationStr;
    return null;
  }

  //TODO: handle page == "" and tool changed
  //TODO: handle page == "" and tool == "" and view changed
  let isPageChange = false;
  let isToolChange = false;
  let isViewChange = false;
  if (lastPageToolView.current.page !== nextPageToolView.page) {
    //Page changed!
    isPageChange = true;
    if (nextPageToolView.tool === '') {
      //Load default
      nextMenusAndPanels = navigationObj[nextPageToolView.page].default;
      if (Object.keys(nextMenusAndPanels).includes('defaultTool')) {
        const url =
          window.location.origin +
          window.location.pathname +
          '#' +
          location.pathname +
          '?' +
          encodeParams({ tool: nextMenusAndPanels.defaultTool });
        //update url without pushing on to history
        window.history.replaceState('', '', url);
        nextMenusAndPanels =
          navigationObj[nextPageToolView.page][nextMenusAndPanels.defaultTool];
      }
    } else {
      nextMenusAndPanels =
        navigationObj[nextPageToolView.page][nextPageToolView.tool];
    }
  } else if (lastPageToolView.current.tool !== nextPageToolView.tool) {
    //Tool Changed
    isToolChange = true;
    //TODO: Check for default view
    nextMenusAndPanels =
      navigationObj[nextPageToolView.page][nextPageToolView.tool];
  } else if (lastPageToolView.current.view !== nextPageToolView.view) {
    //View changed!
    isViewChange = true;
    //New object so we can use it as a template to add keys to
    //Also causes refresh as useState will see it as a new object in root
    nextMenusAndPanels = {
      ...navigationObj[nextPageToolView.page][nextPageToolView.tool],
    };
  }

  let searchObj = {};

  //Update recoil isURLChange
  if (isURLChange) {
    searchObj = Object.fromEntries(new URLSearchParams(location.search));
    setSearchParamAtom(searchObj);
    nextPageToolView['params'] = { ...searchObj };
    delete nextPageToolView['params'].tool;
    // console.log(">>>isURLChange nextPageToolView",nextPageToolView) //Changed this to keep params

    setRecoilPageToolView(nextPageToolView);
  }

  //Update Navigation Leave
  //Only when leaving page or tool
  //TODO: test for main panel change???
  if (isPageChange || isToolChange) {
    // if (isPageChange || isToolChange || isViewChange){
    if (leaveComponentName.current) {
      setOnLeaveStr((was) => ({
        str: leaveComponentName.current,
        updateNum: was.updateNum + 1,
      }));
    }
    leaveComponentName.current = null;
    if (nextMenusAndPanels && nextMenusAndPanels.onLeave) {
      leaveComponentName.current = nextMenusAndPanels.onLeave;
    }
    setSuppressMenus(null); //Reset suppress menus
  }

  //Defaults for undefined
  if (nextMenusAndPanels && nextMenusAndPanels.displaySettings === undefined) {
    nextMenusAndPanels.displaySettings = true;
  }

  //Only update ToolRoot if nextMenusAndPanels was indicated as a change
  if (
    nextMenusAndPanels &&
    JSON.stringify(nextPageToolView) !==
      JSON.stringify(lastPageToolView.current)
  ) {
    backPageToolView.current = lastPageToolView.current; //Set PageToolView for back button
    let params = {};
    if (isURLChange) {
      params = searchObj;
    } else if (isRecoilChange) {
      params = recoilPageToolView.params;
    }

    backParams.current = currentParams.current; //Set params for back button to the previous page's params
    currentParams.current = params;

    //waitForMenuSuppression
    //If wait for suppression only display main panel and menu cap
    if (nextMenusAndPanels.waitForMenuSuppression) {
      let reducedSetMenusAndPanels = { ...nextMenusAndPanels };
      reducedSetMenusAndPanels.currentMenus = [];
      reducedSetMenusAndPanels.menusInitOpen = [];
      reducedSetMenusAndPanels.menusTitles = [];
      reducedSetMenusAndPanels.headerControls = [];

      props.setToolRootMenusAndPanels(reducedSetMenusAndPanels);
    } else {
      props.setToolRootMenusAndPanels(nextMenusAndPanels);
    }
  }

  if (isRecoilChange) {
    //push url with no refresh
    let tool = nextPageToolView.tool;
    let pathname = '/' + recoilPageToolView.page;
    searchObj = { ...recoilPageToolView.params };
    if (tool !== '' && tool !== undefined) {
      searchObj = { tool, ...recoilPageToolView.params };
    }

    let search = '';
    if (Object.keys(searchObj).length > 0) {
      search = '?' + encodeParams(searchObj);
    }

    const urlPush = pathname + search;

    if (location.search !== search) {
      setSearchParamAtom(searchObj);
    }

    //Don't add to the url history if it's the same location the browser is at
    if (location.pathname !== pathname || location.search !== search) {
      history.push(urlPush);
    }
  }

  lastSearchObj.current = searchObj;
  lastLocationStr.current = locationStr;
  lastPageToolView.current = nextPageToolView;
  return null;
}

const LoadingFallback = styled.div`
  background-color: hsl(0, 0%, 99%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  width: 100%;
  height: 100%;
`;
