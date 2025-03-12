import React from "react";

import { createBrowserRouter, RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";

import "@doenet/doenetml-iframe/style.css";

import { MathJaxContext } from "better-react-mathjax";
import {
  loader as exploreLoader,
  action as exploreAction,
  Explore,
} from "./Tools/_framework/Paths/Explore";
import { action as communityAdminAction } from "./Tools/_framework/Paths/CommunityAdmin";
import {
  loader as adminLoader,
  OldAdmin,
} from "./Tools/_framework/Paths/OldAdmin";
import {
  loader as curationLoader,
  action as curationAction,
  Curation,
} from "./Tools/_framework/Paths/Curation";

import {
  loader as siteLoader,
  SiteHeader,
} from "./Tools/_framework/Paths/SiteHeader";
import {
  loader as carouselLoader,
  // action as homeAction,
  Home,
} from "./Tools/_framework/Paths/Home";

import {
  loader as activitiesLoader,
  action as activitiesAction,
  Activities,
} from "./Tools/_framework/Paths/Activities";
import {
  loader as sharedActivitiesLoader,
  action as sharedActivitiesAction,
  SharedActivities,
} from "./Tools/_framework/Paths/SharedActivities";
import {
  loader as activityViewerLoader,
  action as activityViewerAction,
  ActivityViewer,
} from "./Tools/_framework/Paths/ActivityViewer";
import {
  loader as assignedLoader,
  action as assignedAction,
  Assigned,
} from "./Tools/_framework/Paths/Assigned";
import {
  loader as assignmentDataLoader,
  AssignmentData,
} from "./Tools/_framework/Paths/AssignmentResponseOverview";
import {
  loader as assignmentAnswerResponsesLoader,
  action as assignmentAnswerResponsesAction,
  AssignmentAnswerResponses,
} from "./Tools/_framework/Paths/AssignmentAnswerResponses";
import {
  loader as assignmentAnswerResponseHistoryLoader,
  action as assignmentAnswerResponseHistoryAction,
  AssignmentAnswerResponseHistory,
} from "./Tools/_framework/Paths/AssignmentAnswerResponseHistory";
import {
  loader as assignmentStudentDataLoader,
  action as assignmentStudentDataAction,
  AssignmentStudentData,
  assignedAssignmentDataloader,
} from "./Tools/_framework/Paths/AssignmentStudentData";
import {
  loader as enterClassCodeLoader,
  action as enterClassCodeAction,
  EnterClassCode,
} from "./Tools/_framework/Paths/EnterClassCode";
import {
  loader as assignmentViewerLoader,
  action as assignmentViewerAction,
  AssignmentViewer,
} from "./Tools/_framework/Paths/AssignmentViewer";
import {
  loader as allAssignmentScoresLoader,
  AllAssignmentScores,
} from "./Tools/_framework/Paths/AllAssignmentScores";
import {
  loader as studentDataLoader,
  StudentData,
  assignedDataloader,
} from "./Tools/_framework/Paths/StudentData";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import ErrorPage from "./Tools/_framework/Paths/ErrorPage";

import "@fontsource/jost";
import {
  ActivityEditor,
  loader as activityEditorLoader,
  action as activityEditorAction,
} from "./Tools/_framework/Paths/ActivityEditor";
import {
  CodeViewer,
  loader as codeViewerLoader,
} from "./Tools/_framework/Paths/CodeViewer";
import { mathjaxConfig } from "@doenet/doenetml-iframe";
import {
  SignIn,
  action as signInAction,
} from "./Tools/_framework/Paths/SignIn";
import {
  ConfirmSignIn,
  loader as confirmSignInLoader,
  action as confirmSignInAction,
} from "./Tools/_framework/Paths/ConfirmSignIn";
import {
  ChangeName,
  loader as changeNameLoader,
  action as changeNameAction,
} from "./Tools/_framework/Paths/ChangeName";

const theme = extendTheme({
  fonts: {
    body: "Jost",
  },
  textStyles: {
    primary: {
      fontFamily: "Jost",
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
    // initialColorMode: "system",
    // useSystemColorMode: true,
  },
  colors: {
    doenet_blue: {
      100: "#a6f19f", //Ghost/Outline Click
      200: "#c1292e", //Normal Button - Dark Mode - Background
      300: "#f5ed85", //Normal Button - Dark Mode - Hover
      400: "#949494", //Normal Button - Dark Mode - Click
      500: "#1a5a99", //Normal Button - Light Mode - Background
      600: "#757c0d", //Normal Button - Light Mode - Hover //Ghost/Outline BG
      700: "#d1e6f9", //Normal Button - Light Mode - Click
      800: "#6d4445",
      900: "#4a03d9",
    },
    doenet: {
      mainBlue: "#1a5a99",
      lightBlue: "#b8d2ea",
      solidLightBlue: "#8fb8de",
      mainGray: "#e3e3e3",
      mediumGray: "#949494",
      lightGray: "#e7e7e7",
      donutBody: "#eea177",
      donutTopping: "#6d4445",
      mainRed: "#c1292e",
      lightRed: "#eab8b8",
      mainGreen: "#459152",
      canvas: "#ffffff",
      canvastext: "#000000",
      lightGreen: "#a6f19f",
      lightYellow: "#f5ed85",
      whiteBlankLink: "#6d4445",
      mainYellow: "#94610a",
      mainPurple: "#4a03d9",
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    loader: siteLoader,
    element: (
      <>
        <ChakraProvider theme={theme}>
          <MathJaxContext
            version={3}
            config={mathjaxConfig}
            // onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
          >
            <SiteHeader />
          </MathJaxContext>
        </ChakraProvider>
      </>
    ),
    errorElement: (
      <ChakraProvider theme={theme}>
        <ErrorPage />
      </ChakraProvider>
    ),
    children: [
      {
        path: "/",
        loader: carouselLoader,
        // action: homeAction,
        errorElement: <ErrorPage />,
        element: <Home />,
      },
      {
        path: "explore",
        loader: exploreLoader,
        action: exploreAction,
        element: <Explore />,
        errorElement: <ErrorPage />,
      },
      {
        path: "explore/:systemId",
        loader: exploreLoader,
        action: exploreAction,
        element: <Explore />,
        errorElement: <ErrorPage />,
      },
      {
        path: "explore/:systemId/:categoryId",
        loader: exploreLoader,
        action: exploreAction,
        element: <Explore />,
        errorElement: <ErrorPage />,
      },
      {
        path: "explore/:systemId/:categoryId/:subCategoryId",
        loader: exploreLoader,
        action: exploreAction,
        element: <Explore />,
        errorElement: <ErrorPage />,
      },
      {
        path: "explore/:systemId/:categoryId/:subCategoryId/:classificationId",
        loader: exploreLoader,
        action: exploreAction,
        element: <Explore />,
        errorElement: <ErrorPage />,
      },
      {
        path: "oldAdmin",
        loader: adminLoader,
        // sharing an action with the explore page is somewhat intentional
        // as it shows cards and admins have the same actions that they can perform
        // on cards as they can on the explore page
        // TODO - determine if this is an okay way to share functionality across
        // pages or a bad idea
        action: communityAdminAction,
        element: <OldAdmin />,
        errorElement: <ErrorPage />,
      },
      {
        path: "curation",
        loader: curationLoader,
        action: curationAction,
        element: <Curation />,
        errorElement: <ErrorPage />,
      },
      {
        path: "curation/:parentId",
        loader: curationLoader,
        action: curationAction,
        element: <Curation />,
        errorElement: <ErrorPage />,
      },
      {
        path: "activities/:userId",
        loader: activitiesLoader,
        action: activitiesAction,
        element: <Activities />,
        errorElement: <ErrorPage />,
      },
      {
        path: "activities/:userId/:parentId",
        loader: activitiesLoader,
        action: activitiesAction,
        element: <Activities />,
        errorElement: <ErrorPage />,
      },
      {
        path: "sharedActivities/:ownerId",
        loader: sharedActivitiesLoader,
        action: sharedActivitiesAction,
        element: <SharedActivities />,
        errorElement: <ErrorPage />,
      },
      {
        path: "sharedActivities/:ownerId/:parentId",
        loader: sharedActivitiesLoader,
        action: sharedActivitiesAction,
        element: <SharedActivities />,
        errorElement: <ErrorPage />,
      },
      {
        path: "activityViewer/:contentId",
        loader: activityViewerLoader,
        action: activityViewerAction,
        errorElement: <ErrorPage />,
        element: <ActivityViewer />,
      },
      {
        path: "activityEditor/:contentId",
        loader: activityEditorLoader,
        action: activityEditorAction,
        element: <ActivityEditor />,
        errorElement: <ErrorPage />,
      },
      {
        path: "codeViewer",
        loader: codeViewerLoader,
        errorElement: <ErrorPage />,
        element: <CodeViewer />,
      },
      {
        path: "codeViewer/:contentId",
        loader: codeViewerLoader,
        errorElement: <ErrorPage />,
        element: <CodeViewer />,
      },
      {
        path: "assigned",
        action: assignedAction,
        loader: assignedLoader,
        element: <Assigned />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignedData",
        loader: assignedDataloader,
        element: <StudentData />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignedData/:contentId",
        action: assignmentStudentDataAction,
        loader: assignedAssignmentDataloader,
        element: <AssignmentStudentData />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentData/:contentId",
        loader: assignmentDataLoader,
        element: <AssignmentData />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentAnswerResponses/:contentId/:docId/:docVersionNum",
        loader: assignmentAnswerResponsesLoader,
        action: assignmentAnswerResponsesAction,
        element: <AssignmentAnswerResponses />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentAnswerResponseHistory/:contentId/:docId/:docVersionNum/:userId",
        loader: assignmentAnswerResponseHistoryLoader,
        action: assignmentAnswerResponseHistoryAction,
        element: <AssignmentAnswerResponseHistory />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentData/:contentId/:userId",
        action: assignmentStudentDataAction,
        loader: assignmentStudentDataLoader,
        element: <AssignmentStudentData />,
        errorElement: <ErrorPage />,
      },
      {
        path: "allAssignmentScores",
        loader: allAssignmentScoresLoader,
        element: <AllAssignmentScores />,
        errorElement: <ErrorPage />,
      },
      {
        path: "allAssignmentScores/:parentId",
        loader: allAssignmentScoresLoader,
        element: <AllAssignmentScores />,
        errorElement: <ErrorPage />,
      },
      {
        path: "studentData/:userId",
        loader: studentDataLoader,
        element: <StudentData />,
        errorElement: <ErrorPage />,
      },
      {
        path: "studentData/:userId/:parentId",
        loader: studentDataLoader,
        element: <StudentData />,
        errorElement: <ErrorPage />,
      },
      {
        path: "code",
        loader: enterClassCodeLoader,
        action: enterClassCodeAction,
        element: <EnterClassCode />,
        errorElement: <ErrorPage />,
      },
      {
        path: "code/:classCode",
        loader: assignmentViewerLoader,
        action: assignmentViewerAction,
        element: <AssignmentViewer />,
        errorElement: <ErrorPage />,
      },
      {
        path: "signIn",
        action: signInAction,
        errorElement: <ErrorPage />,
        element: <SignIn />,
      },
      {
        path: "confirmSignIn",
        loader: confirmSignInLoader,
        action: confirmSignInAction,
        errorElement: <ErrorPage />,
        element: <ConfirmSignIn />,
      },
      {
        path: "changeName",
        loader: changeNameLoader,
        action: changeNameAction,
        errorElement: <ErrorPage />,
        element: <ChangeName />,
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={router} />);
