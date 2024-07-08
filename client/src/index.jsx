import React from "react";

import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { createRoot } from "react-dom/client";

import "@doenet/doenetml-iframe/style.css";

import { MathJaxContext } from "better-react-mathjax";
import {
  loader as communityLoader,
  action as communityAction,
  Community,
} from "./Tools/_framework/Paths/Community";
import { loader as adminLoader, Admin } from "./Tools/_framework/Paths/Admin";
import {
  loader as libraryLoader,
  Library,
} from "./Tools/_framework/Paths/Library";
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
  loader as activityViewerLoader,
  action as activityViewerAction,
  ActivityViewer,
} from "./Tools/_framework/Paths/ActivityViewer";
import {
  loader as assignmentsLoader,
  action as assignmentsAction,
  Assignments,
} from "./Tools/_framework/Paths/Assignments";
import {
  loader as assignmentEditorLoader,
  action as assignmentEditorAction,
  AssignmentEditor,
} from "./Tools/_framework/Paths/AssignmentEditor";
import {
  loader as assignmentDataLoader,
  action as assignmentDataAction,
  AssignmentData,
} from "./Tools/_framework/Paths/AssignmentData";
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
  PublicEditor,
  loader as publicEditorLoader,
} from "./Tools/_framework/Paths/PublicEditor";
import { mathjaxConfig } from "@doenet/doenetml-iframe";
import SignIn from "./Tools/_framework/ToolPanels/SignIn";
import SignOut from "./Tools/_framework/ToolPanels/SignOut";

{
  /* <Button colorScheme="doenet_blue">TESTING 123</Button> */
}

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
        path: "/library",
        loader: libraryLoader,
        // sharing an action with the community page is somewhat intentional
        // as it shows cards and admins have the same actions that they can perform
        // on cards as they can on the community page
        // TODO - determine if this is an okay way to share functionality across
        // pages or a bad idea
        action: communityAction,
        element: <Library />,
        errorElement: <ErrorPage />,
      },
      {
        path: "community",
        loader: communityLoader,
        action: communityAction,
        // action: communitySearchAction,
        element: <Community />,
        errorElement: <ErrorPage />,
      },
      {
        path: "admin",
        loader: adminLoader,
        // sharing an action with the community page is somewhat intentional
        // as it shows cards and admins have the same actions that they can perform
        // on cards as they can on the community page
        // TODO - determine if this is an okay way to share functionality across
        // pages or a bad idea
        action: communityAction,
        element: <Admin />,
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
        path: "activities/:userId/:folderId",
        loader: activitiesLoader,
        action: activitiesAction,
        element: <Activities />,
        errorElement: <ErrorPage />,
      },
      {
        path: "activityViewer/:activityId",
        loader: activityViewerLoader,
        action: activityViewerAction,
        errorElement: <ErrorPage />,
        element: <ActivityViewer />,
      },
      {
        path: "activityEditor/:activityId",
        loader: activityEditorLoader,
        action: activityEditorAction,
        element: <ActivityEditor />,
        errorElement: <ErrorPage />,
      },
      {
        path: "activityEditor/:activityId/:docId",
        loader: activityEditorLoader,
        action: activityEditorAction,
        // errorElement: <div>Error!</div>,
        element: <ActivityEditor />,
        errorElement: <ErrorPage />,
      },
      {
        path: "publicEditor",
        loader: publicEditorLoader,
        errorElement: <ErrorPage />,
        element: <PublicEditor />,
      },
      {
        path: "publicEditor/:activityId",
        loader: publicEditorLoader,
        errorElement: <ErrorPage />,
        element: <PublicEditor />,
      },
      {
        path: "publicEditor/:activityId/:docId",
        loader: publicEditorLoader,
        errorElement: <ErrorPage />,
        element: <PublicEditor />,
      },
      {
        path: "assignments",
        loader: assignmentsLoader,
        action: assignmentsAction,
        element: <Assignments />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentEditor/:assignmentId",
        loader: assignmentEditorLoader,
        action: assignmentEditorAction,
        element: <AssignmentEditor />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentData/:assignmentId",
        loader: assignmentDataLoader,
        action: assignmentDataAction,
        element: <AssignmentData />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentAnswerResponses/:assignmentId/:docId/:docVersionId",
        loader: assignmentAnswerResponsesLoader,
        action: assignmentAnswerResponsesAction,
        element: <AssignmentAnswerResponses />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentAnswerResponseHistory/:assignmentId/:docId/:docVersionId/:userId",
        loader: assignmentAnswerResponseHistoryLoader,
        action: assignmentAnswerResponseHistoryAction,
        element: <AssignmentAnswerResponseHistory />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentData/:activityId/:userId",
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
        path: "allAssignmentScores/:folderId",
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
        path: "classCode",
        loader: enterClassCodeLoader,
        action: enterClassCodeAction,
        element: <EnterClassCode />,
        errorElement: <ErrorPage />,
      },
      {
        path: "classCode/:classCode",
        loader: assignmentViewerLoader,
        action: assignmentViewerAction,
        element: <AssignmentViewer />,
        errorElement: <ErrorPage />,
      },
      {
        path: "signIn",
        errorElement: <ErrorPage />,
        element: <SignIn />,
      },
      {
        path: "signOut",
        errorElement: <ErrorPage />,
        element: <SignOut />,
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
