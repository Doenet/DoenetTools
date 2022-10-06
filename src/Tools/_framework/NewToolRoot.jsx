import React, { useState, lazy, Suspense, useRef, useEffect } from 'react';
import {
  atom,
  selector,
  useRecoilValue,
  atomFamily,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import styled, { keyframes } from 'styled-components';
import Toast from './Toast';
import ContentPanel, { panelsInfoAtom } from './Panels/NewContentPanel';
import axios from 'axios';
// import { GlobalStyle } from "../../Tools/DoenetStyle";
import MainPanel from './Panels/NewMainPanel';
import SupportPanel from './Panels/NewSupportPanel';
import MenuPanel from './Panels/NewMenuPanel';
import FooterPanel from './Panels/FooterPanel';
import { animated } from '@react-spring/web';

import { useNavigate, useLocation } from 'react-router';

const ToolContainer = styled(animated.div)`
  display: grid;
  grid-template:
    'menuPanel contentPanel ' 1fr
    'menuPanel footerPanel ' auto
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  background-color: var(--mainGray);
  position: fixed;
  top: 0;
  left: 0;
  padding: 0px;
  gap: 0px;
  box-sizing: border-box;
  border: var(--canvastext);
  color: var(--canvastext);
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
        console.error('Error loading user profile', error.message);
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

// **** ToolRoot ****
//Keep  as simple as we can
//Keep refreshes to a minimum
//Don't use recoil in ToolRoot

export default function ToolRoot() {
  // console.log('>>>===ToolRoot ');
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
    hasNoHeaderPanel: false,
    headerControls: [],
    displaySettings: true,
    footer: null,
  });
  let mainPanel = null;
  let supportPanel = <SupportPanel hide={true}>null</SupportPanel>;

  const [menusOpen, setMenusOpen] = useState(true);

  const LazyPanelObj = useRef({
    Empty: lazy(() => import('./ToolPanels/Empty')),
    NotFound: lazy(() => import('./ToolPanels/NotFound')),
    AccountSettings: lazy(() => import('./ToolPanels/AccountSettings')),
    HomePanel: lazy(() => import('./ToolPanels/HomePanel')),
    PublicActivityViewer: lazy(() => import('./ToolPanels/PublicActivityViewer')),
    CourseCards: lazy(() => import('./ToolPanels/CourseCards')),
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
    DraftAssignmentViewer: lazy(() => import('./ToolPanels/DraftAssignmentViewer')),
    DataPanel: lazy(() => import('./ToolPanels/DataPanel')),
    SurveyDataViewer: lazy(() => import('./ToolPanels/SurveyDataViewer')),
    DoenetMLEditor: lazy(() => import('./ToolPanels/DoenetMLEditor')),
    People: lazy(() => import('./ToolPanels/People')),
    ChooseLearnerPanel: lazy(() => import('./ToolPanels/ChooseLearnerPanel')),
    EndExamPanel: lazy(() => import('./ToolPanels/EndExamPanel')),
    UMNEndExamPanel: lazy(() => import('./ToolPanels/UMNEndExamPanel')),
    UMNWelcomePlacementExam: lazy(() => import('./ToolPanels/UMNWelcomePlacementExam')),
    GuestDoenetMLEditor:lazy(() => import('./ToolPanels/GuestDoenetMLEditor')),
    GuestEditorViewer:lazy(() => import('./ToolPanels/GuestEditorViewer')),
    RolesEditor: lazy(() => import('./ToolPanels/RoleEditor')),
  }).current;

  const LazyControlObj = useRef({
    BackButton: lazy(() => import('./HeaderControls/BackButton')),
    ViewerUpdateButton: lazy(() =>
      import('./HeaderControls/ViewerUpdateButton'),
    ),
    NavigationBreadCrumb: lazy(() =>
      import('./HeaderControls/NavigationBreadCrumb'),
    ),
    ChooserBreadCrumb: lazy(() => import('./HeaderControls/ChooserBreadCrumb')),
    DashboardBreadCrumb: lazy(() =>
      import('./HeaderControls/DashboardBreadCrumb'),
    ),
    PeopleBreadCrumb: lazy(() =>
      import('./HeaderControls/PeopleBreadCrumb'),
    ),
    DataBreadCrumb: lazy(() => import('./HeaderControls/DataBreadCrumb')),
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
      fallback={
        <LoadingFallback>
          <Svg viewBox="0 0 130 140">
            <DonutG1>
              <Circle
                id="donut" 
                fill="var(--donutBody)" 
                r="60" 
              />
              <Circle
                id="donut-topping"
                fill="var(--donutTopping)"
                r="48"
              />
              <Circle 
                id="donut-hole"  
                fill="var(--canvas)"
                r="19"
              />
            </DonutG1>
          </Svg>
          <Svg viewBox="0 0 130 140">
            <DonutG2>
              <Circle
                id="donut" 
                fill="var(--donutBody)" 
                r="60" 
              />
              <Circle
                id="donut-topping"
                fill="var(--donutTopping)"
                r="48"
              />
              <Circle 
                id="donut-hole"  
                fill="var(--canvas)"
                r="19"
              />
            </DonutG2>
          </Svg>
          <Svg viewBox="0 0 130 140">
            <DonutG3>
              <Circle
                id="donut" 
                fill="var(--donutBody)" 
                r="60" 
              />
              <Circle
                id="donut-topping"
                fill="var(--donutTopping)"
                r="48"
              />
              <Circle 
                id="donut-hole"  
                fill="var(--canvas)"
                r="19"
              />
            </DonutG3>
          </Svg>
        </LoadingFallback>
      }
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
          fallback={
            <LoadingFallback display="static">
              <Table>
                <TBody>
                  <Tr>
                    <Td className="Td2">
                    </Td>
                    <Td className="Td3">
                      <Td3Span></Td3Span>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td className="Td2">
                    </Td>
                    <Td className="Td3">
                      <Td3Span></Td3Span>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td className="Td2">
                    </Td>
                    <Td className="Td3">
                      <Td3Span></Td3Span>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td className="Td2">
                    </Td>
                    <Td className="Td3">
                      <Td3Span></Td3Span>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td className="Td2">
                    </Td>
                    <Td className="Td3">
                      <Td3Span></Td3Span>
                    </Td>
                  </Tr>
                </TBody>
              </Table>
            </LoadingFallback>
          }
        >
          {React.createElement(LazyPanelObj[spType], { SupportPanelKey })}
        </Suspense>
      </SupportPanel>
    );
  }

  let headerControls = null;
  if (toolRootMenusAndPanels.headerControls) {
    headerControls = [];
    for (const [, controlName] of Object.entries(
      toolRootMenusAndPanels.headerControls,
    )) {
      const controlObj = LazyControlObj[controlName];
      if (controlObj) {
        const key = `headerControls${MainPanelKey}`;
        headerControls.push(
          <Suspense
            key={key}
            fallback={
              <LoadingFallback>
                <BreadcrumbContainer>
                  <BreadcrumbOutline/>
                </BreadcrumbContainer>
              </LoadingFallback>
            }
          >
            {React.createElement(controlObj, { key: { key } })}
          </Suspense>,
        );
      }
    }
  }

  let menus = <MenuPanel key="menuPanel" hide={true} />;
  if (menusOpen && !toolRootMenusAndPanels.hasNoMenuPanel) {
    menus = (
      <MenuPanel
        key="menuPanel"
        hide={false}
        setMenusOpen={setMenusOpen}
        menusOpen={menusOpen}
        menuPanelCap={toolRootMenusAndPanels.menuPanelCap}
        menusTitles={toolRootMenusAndPanels.menusTitles}
        currentMenus={toolRootMenusAndPanels.currentMenus}
        initOpen={toolRootMenusAndPanels.menusInitOpen}
        displaySettings={toolRootMenusAndPanels.displaySettings}
      />
    );
  }

  //If no menu panel then don't show open menu button
  let openMenuButton = !menusOpen;
  if (toolRootMenusAndPanels.hasNoMenuPanel) {
    openMenuButton = false;
  }

  let footer = null;

  if (toolRootMenusAndPanels.footer) {
    let footerKey = `footer`;
    footer = (
      <FooterPanel
        id="keyboard"
        isInitOpen={toolRootMenusAndPanels.footer.open}
        height={toolRootMenusAndPanels.footer.height}
        aria-label="keyboard"
      >
        <Suspense
          key={footerKey}
          // TODO: loading animation for footer
          fallback={<LoadingFallback>loading...</LoadingFallback>}
        >
          {React.createElement(
            LazyFooterObj[toolRootMenusAndPanels.footer.component],
            {
              key: { footerKey },
            },
          )}
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
              hasNoHeaderPanel={toolRootMenusAndPanels.hasNoHeaderPanel}
            >
              {mainPanel}
            </MainPanel>
          }
          hasNoHeaderPanel={toolRootMenusAndPanels.hasNoHeaderPanel}
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
// footer: {height,open,component}
// initialProportion: 1,

// /umn/1271qual
// /umn/1151qual
// /umn/mathpl
// /umn/ to pick or algpl

let navigationObj = {
  umn: {
    default: {
      defaultTool: 'mathplwelcome',
    },
    mathplwelcome: {
      pageName: 'welcome',
      currentMainPanel: 'UMNWelcomePlacementExam',
      // displaySettings: false,
      hasNoMenuPanel: true,
    },
    mathplexam: {
      pageName: 'exam',
      menuPanelCap: 'AssignmentInfoCap',
      currentMainPanel: 'AssignmentViewer',
      currentMenus: ['TimerMenu'],
      menusTitles: ['Time Remaining'],
      menusInitOpen: [true],
      headerControls: [],
      displaySettings: false,
      waitForMenuSuppression: true,
      footer: { height: 250, open: false, component: 'MathInputKeyboard' },
    },
    endExam: {
      pageName: 'endExam',
      currentMainPanel: 'UMNEndExamPanel',
      displaySettings: false,
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
      footer: { height: 250, open: false, component: 'MathInputKeyboard' },
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
      footer: { height: 250, open: false, component: 'MathInputKeyboard' },
    },
    courseChooser: {
      //allCourses
      pageName: 'Course',
      currentMainPanel: 'CourseCards',
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
      menusTitles: ['Class Times', 'Content by week settings'],
      menusInitOpen: [false, false],
      headerControls: ['DashboardBreadCrumb'],
      onLeave: 'DashboardLeave',
      waitForMenuSuppression: true,
      color: 'var(--canvastext)',
    },
    draftactivity: {
      pageName: 'DraftActivity',
      menuPanelCap: 'DraftActivityCap',
      currentMainPanel: 'DraftAssignmentViewer',
      currentMenus: ['ActivityVariant'],
      menusTitles: ['Activity Variant'],
      menusInitOpen: [],
      headerControls: ['AssignmentBreadCrumb'],
      footer: { height: 250, open: false, component: 'MathInputKeyboard' },
    },
    endExam: {
      pageName: 'endExam',
      currentMainPanel: 'EndExamPanel',
      // displaySettings: false,
      // hasNoMenuPanel: true,
      menuPanelCap: 'AssignmentInfoCap',
      currentMenus: ['CreditAchieved'],
      menusTitles: ['Credit Achieved'],
      menusInitOpen: [true],
      headerControls: ['AssignmentBreadCrumb'],
      // waitForMenuSuppression: true,
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
      // currentMenus: ['AddDriveItems','CutCopyPasteMenu'],
      // menusTitles: ['Add Items','Cut, Copy and Paste'],
      currentMenus: ['CutCopyPasteMenu','AddDriveItems'],
      menusTitles: ['Cut, Copy and Paste','Add Items'],
      menusInitOpen: [true,true],
      headerControls: ['NavigationBreadCrumb'],
      onLeave: 'NavigationLeave',
      waitForMenuSuppression: true,
    },
    editor: {
      //singleFile
      pageName: 'Course',
      menuPanelCap: 'EditorInfoCap',
      currentMainPanel: 'EditorViewer',
      currentMenus: [
        'PageVariant',
        'PageLink',
        'AssignmentSettingsMenu',
        'SupportingFilesMenu',
      ],
      menusTitles: [
        'Page Variant',
        'Page Link',
        'Assignment Settings',
        'Supporting Files',
      ],
      menusInitOpen: [false, false],
      supportPanelOptions: ['DoenetMLEditor'],
      supportPanelTitles: ['DoenetML Editor'],
      supportPanelIndex: 0,
      headerControls: ['EditorBreadCrumb', 'ViewerUpdateButton'],
      // onLeave: 'EditorLeave',
      footer: { height: 250, open: false, component: 'MathInputKeyboard' },
      waitForMenuSuppression: true,
    },
    people: {
      //allStudentsInCourse
      pageName: 'People',
      menuPanelCap: 'DriveInfoCap',
      currentMenus: ['LoadPeople'],
      menusTitles: ['Import Learners'],
      menusInitOpen: [false],
      currentMainPanel: 'People',
      supportPanelOptions: ['RolesEditor'],
      supportPanelTitles: ['Roles Editor'],
      supportPanelIndex: 0,
      headerControls: ['PeopleBreadCrumb'],
      initialProportion: 1,
      // headerControls: ["BackButton"],
    },
    data: {
      pageName: 'data',
      menuPanelCap: 'DataCap',
      currentMainPanel: 'DataPanel', 
      headerControls: ['DataBreadCrumb'],
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
      hasNoHeaderPanel: true,
      displaySettings: false,
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
  public:{
    default:{
      pageName:"PublicActivityViewer",
      currentMenus:[],
      menusTitles:[],
      menusInitOpen:[],
      currentMainPanel:"PublicActivityViewer",
      supportPanelOptions:[],
      supportPanelTitles:[],
      supportPanelIndex:0,
      hasNoMenuPanel: true,
    },
    editor: {
      //singleFile
      pageName: 'GuestEditor',
      currentMainPanel: 'GuestEditorViewer',
      currentMenus: [
        'PageVariant',
      ],
      menusTitles: [
        'Page Variant',
      ],
      menusInitOpen: [false],
      supportPanelOptions: ['GuestDoenetMLEditor'],
      supportPanelTitles: ['DoenetML Editor'],
      supportPanelIndex: 0,
      headerControls: ['ViewerUpdateButton'],
      footer: { height: 250, open: false, component: 'MathInputKeyboard' },
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
    // EditorLeave: lazy(() => import('./EnterLeave/EditorLeave')),
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
  const setPanelsInfoAtom = useSetRecoilState(panelsInfoAtom);


  let lastPageToolView = useRef({ page: 'init', tool: '', view: '' });
  let backPageToolView = useRef({ page: 'init', tool: '', view: '' });
  let backParams = useRef({});
  let currentParams = useRef({});
  let lastLocationStr = useRef('');
  let location = useLocation();
  let navigate = useNavigate();
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

  //initialProportion
  let initialProportion = navigationObj[recoilPageToolView.page]?.[recoilPageToolView.tool]?.initialProportion

  useEffect(()=>{
    let nextInitialProportion = initialProportion;
    if (!nextInitialProportion){ nextInitialProportion = 0.5}
      setPanelsInfoAtom((prev)=>{
        let next = {...prev}
        next.proportion = nextInitialProportion;
        return next;
      })
  },[initialProportion])

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
      const url = window.location.origin + window.location.pathname + 'home';
      //update url without pushing on to history
      window.history.replaceState('', '', url);
      // navigate('/home', { replace: true });
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
          window.location.pathname +
          location.pathname +
          '?' +
          encodeParams({ tool: nextMenusAndPanels.defaultTool });
        //update url without pushing on to history
        // navigate(url, {replace: true});
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
      navigate(urlPush);
    }
  }

  lastSearchObj.current = searchObj;
  lastLocationStr.current = locationStr;
  lastPageToolView.current = nextPageToolView;
  return null;
}


const LoadingFallback = styled.div`
  background-color: var(--canvas);
  border-radius: 4px;
  display: ${props => props.display ? props.display : "flex"};
  justify-content: center;
  align-items: center;
  font-size: 2em;
  width: 100%;
  height: 100%;
`;

const bouncingDonut = keyframes `
  from { transform: translate3d(0, 0px, 0);}
  to { transform: translate3d(0, 20px, 0);}
`;

const Svg = styled.svg`
  width: 130px;
  height: 140px;
  align-items: center;
  margin: 25px;
`;

const DonutG1 = styled.g`
  position: relative;
  animation: ${bouncingDonut} 0.5s ease 0s infinite;
  animation-direction: alternate;
  transform: translate(279, 394.5);
  &:after {
    position: absolute;
  }
`;

const DonutG2 = styled.g`
  position: relative;
  animation: ${bouncingDonut} 0.5s ease 0.15s infinite;
  animation-direction: alternate;
  transform: translate(279, 394.5);
  &:after {
    position: absolute;
  }
`;

const DonutG3 = styled.g`
  position: relative;
  animation: ${bouncingDonut} 0.5s ease 0.25s infinite;
  animation-direction: alternate;
  transform: translate(279, 394.5);
  &:after {
    position: absolute;
  }
`;

const Circle = styled.circle`
  cx: 65;
  cy: 60;
`;

const BreadcrumbContainer = styled.ul`
  list-style: none;
  overflow: hidden;
  height: 21px;
  display: flex;
  margin-left: -35px;
  background-color: var(--canvas);
`;

const shimmerAnimation = keyframes `
  from {
    background-position: -468px 0
  }
  to {
    background-position: 468px 0
  }
`;

const BreadcrumbOutline = styled.li`
  float: left;
  border-radius: 15px;
  padding: 0px 30px 0px 30px;
  /* background: var(--mainGray); */
  /* background-color: var(--canvas); */
  color: black;

  animation-duration: 3s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${shimmerAnimation};
  animation-timing-function: linear;
  background: var(--canvas);
  background: linear-gradient(to right, var(--mainGray) 8%, var(--mainGray) 18%, var(--mainGray) 33%);
  background-size: 1000px 640px;
  position: relative;
`;

const movingGradient = keyframes `
  0% { background-position: -250px 0; }
  100% { background-position: 250px 0; }
`;

const Table = styled.table `
  border-radius: 5px;
  margin: 8px;
`;
const Tr = styled.tr `
  /* border-bottom: 2px solid var(--canvastext); */
`;
const Td = styled.td `
  height: 40px;

  &.Td3 {
    width: 100%;
  }

`;
const TBody = styled.tbody ``;
const Td3Span = styled.span `
  display: block;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(to right, var(--mainGray) 20%, var(--mainGray) 50%, var(--mainGray) 80%);
  background-size: 500px 100px;
  animation-name: ${movingGradient};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;