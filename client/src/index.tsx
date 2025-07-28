import React from "react";

import {
  ActionFunctionArgs,
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { createRoot } from "react-dom/client";

import "@doenet/doenetml-iframe/style.css";

import { MathJaxContext } from "better-react-mathjax";
import {
  loader as exploreLoader,
  action as exploreAction,
  Explore,
} from "./paths/Explore";

import { loader as curateLoader, Curate } from "./paths/Curate";

import {
  loader as siteLoader,
  action as siteAction,
  SiteHeader,
} from "./paths/SiteHeader";
import { loader as carouselLoader, Home } from "./paths/Home";

import {
  loader as activitiesLoader,
  action as activitiesAction,
  Activities,
} from "./paths/Activities";
import {
  loader as sharedActivitiesLoader,
  action as sharedActivitiesAction,
  SharedActivities,
} from "./paths/SharedActivities";
import {
  loader as activityViewerLoader,
  action as activityViewerAction,
  ActivityViewer,
} from "./paths/ActivityViewer";
import {
  loader as assignedLoader,
  action as assignedAction,
  Assigned,
} from "./paths/Assigned";
import {
  loader as assignmentResponseOverviewLoader,
  AssignmentData as AssignmentResponseOverview,
} from "./paths/AssignmentResponseOverview";
import {
  loader as assignmentResponseStudentLoader,
  AssignmentResponseStudent,
} from "./paths/AssignmentResponseStudent";
import {
  action as enterClassCodeAction,
  EnterClassCode,
} from "./paths/EnterClassCode";
import {
  loader as assignmentViewerLoader,
  action as assignmentViewerAction,
  AssignmentViewer,
} from "./paths/AssignmentViewer";
import {
  loader as allAssignmentScoresLoader,
  AllAssignmentScores,
} from "./paths/AllAssignmentScores";
import {
  loader as studentAssignmentScoresLoader,
  StudentAssignmentScores,
  assignedDataloader,
} from "./paths/StudentAssignmentScores";
import {
  loader as trashLoader,
  action as trashAction,
  Trash,
} from "./paths/Trash";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import ErrorPage from "./paths/ErrorPage";

import "@fontsource/jost";
import {
  loader as editorHeaderLoader,
  EditorHeader,
} from "./paths/editor/EditorHeader";
import {
  DoenetMLComparison,
  loader as doenetMLComparisonLoader,
  action as doenetMLComparisonAction,
} from "./paths/DoenetMLComparison";
import { CodeViewer, loader as codeViewerLoader } from "./paths/CodeViewer";
import { mathjaxConfig } from "@doenet/doenetml-iframe";
import { SignIn, action as signInAction } from "./paths/SignIn";
import {
  ConfirmSignIn,
  loader as confirmSignInLoader,
  action as confirmSignInAction,
} from "./paths/ConfirmSignIn";
import {
  ChangeName,
  loader as changeNameLoader,
  action as changeNameAction,
} from "./paths/ChangeName";
import {
  LibraryActivities,
  loader as libraryActivitiesLoader,
  action as libraryActivitiesAction,
} from "./paths/LibraryActivities";
import {
  DocEditorViewMode,
  loader as docEditorViewModeLoader,
} from "./paths/editor/DocEditorViewMode";
import {
  loader as docEditorEditModeLoader,
  DocEditorEditMode,
} from "./paths/editor/DocEditorEditMode";
import {
  CompoundEditorViewMode,
  loader as compoundEditorViewModeLoader,
} from "./paths/editor/CompoundEditorViewMode";
import {
  CompoundEditorEditMode,
  loader as compoundEditorEditModeLoader,
  action as compoundEditorEditModeAction,
} from "./paths/editor/CompoundEditorEditMode";
import {
  EditorSettingsMode,
  loader as docEditorSettingsModeLoader,
} from "./paths/editor/EditorSettingsMode";
import axios, { AxiosError } from "axios";
import { loadShareStatus } from "./popups/ShareMyContentModal";
import {
  DocEditorHistoryMode,
  loader as docEditorHistoryModeLoader,
} from "./paths/editor/DocEditorHistoryMode";
import {
  DocEditorRemixMode,
  loader as docEditorRemixModeLoader,
} from "./paths/editor/DocEditorRemixMode";
import {
  EditorLibraryMode,
  loader as editorLibraryModeLoader,
} from "./paths/editor/EditorLibraryMode";

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
        action: siteAction,
        errorElement: <ErrorPage />,
        element: <Home />,
      },
      {
        path: "explore/:systemId?/:categoryId?/:subCategoryId?/:classificationId?",
        loader: exploreLoader,
        action: exploreAction,
        element: <Explore />,
        errorElement: <ErrorPage />,
      },
      {
        path: "curate",
        loader: curateLoader,
        element: <Curate />,
        errorElement: <ErrorPage />,
      },
      {
        path: "libraryActivities/:parentId?",
        loader: libraryActivitiesLoader,
        action: libraryActivitiesAction,
        element: <LibraryActivities />,
        errorElement: <ErrorPage />,
      },
      {
        path: "activities/:userId/:parentId?",
        loader: activitiesLoader,
        action: activitiesAction,
        element: <Activities />,
        errorElement: <ErrorPage />,
      },
      {
        path: "trash",
        loader: trashLoader,
        action: trashAction,
        element: <Trash />,
        errorElement: <ErrorPage />,
      },
      {
        path: "sharedActivities/:ownerId/:parentId?",
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
        path: "documentEditor/:contentId",
        loader: editorHeaderLoader,
        action: genericContentIdAction,
        element: <EditorHeader />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "edit",
            loader: docEditorEditModeLoader,
            element: <DocEditorEditMode />,
            errorElement: <ErrorPage />,
          },
          {
            path: "view",
            loader: docEditorViewModeLoader,
            element: <DocEditorViewMode />,
            errorElement: <ErrorPage />,
          },
          {
            path: "settings",
            loader: docEditorSettingsModeLoader,
            action: genericContentIdAction,
            element: <EditorSettingsMode />,
            errorElement: <ErrorPage />,
          },
          {
            path: "history",
            loader: docEditorHistoryModeLoader,
            action: genericContentIdAction,
            element: <DocEditorHistoryMode />,
            errorElement: <ErrorPage />,
          },
          {
            path: "remixes",
            loader: docEditorRemixModeLoader,
            action: genericContentIdAction,
            element: <DocEditorRemixMode />,
            errorElement: <ErrorPage />,
          },
          {
            path: "library",
            loader: editorLibraryModeLoader,
            action: genericContentIdAction,
            element: <EditorLibraryMode />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: "compoundEditor/:contentId",
        loader: editorHeaderLoader,
        action: genericContentIdAction,
        element: <EditorHeader />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "edit",
            loader: compoundEditorEditModeLoader,
            action: compoundEditorEditModeAction,
            element: <CompoundEditorEditMode />,
            errorElement: <ErrorPage />,
          },
          {
            path: "view",
            loader: compoundEditorViewModeLoader,
            element: <CompoundEditorViewMode />,
            errorElement: <ErrorPage />,
          },
          {
            path: "settings",
            loader: docEditorSettingsModeLoader,
            action: genericContentIdAction,
            element: <EditorSettingsMode />,
            errorElement: <ErrorPage />,
          },
          {
            path: "remixes",
            loader: docEditorRemixModeLoader,
            action: genericContentIdAction,
            element: <DocEditorRemixMode />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: "activityCompare/:contentId/:compareId",
        loader: doenetMLComparisonLoader,
        action: doenetMLComparisonAction,
        element: <DoenetMLComparison />,
        errorElement: <ErrorPage />,
      },
      {
        path: "codeViewer/:contentId?",
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
        element: <StudentAssignmentScores />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignedData/:contentId",
        loader: assignmentResponseStudentLoader,
        element: <AssignmentResponseStudent />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentData/:contentId",
        loader: assignmentResponseOverviewLoader,
        element: <AssignmentResponseOverview />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentData/:contentId/:studentUserId",
        loader: assignmentResponseStudentLoader,
        element: <AssignmentResponseStudent />,
        errorElement: <ErrorPage />,
      },
      {
        path: "allAssignmentScores/:parentId?",
        loader: allAssignmentScoresLoader,
        element: <AllAssignmentScores />,
        errorElement: <ErrorPage />,
      },
      {
        path: "studentAssignmentScores/:userId/:parentId?",
        loader: studentAssignmentScoresLoader,
        element: <StudentAssignmentScores />,
        errorElement: <ErrorPage />,
      },
      {
        path: "code",
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
      {
        path: "loadShareStatus/:contentId",
        loader: loadShareStatus,
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={router} />);

async function genericContentIdAction({ request, params }: ActionFunctionArgs) {
  const { path, ...body } = await request.json();

  try {
    await axios.post(`/api/${path}`, {
      contentId: params.contentId,
      ...body,
    });

    return null;
  } catch (e) {
    /**
     * Special case: sharing content with specific people by email address
     * Normally, when the server returns an error, we want to go the error page.
     * However, in this case, it might mean that the owner entered an invalid email address.
     * If that's the case, catch it and let the route deal with it (handled in component EditorHeader).
     */
    if (path === "share/shareContent" && e instanceof AxiosError) {
      const error = e.response!.data!.error;
      const details = e.response!.data!.details;
      if (error === "Invalid data" && details[0]?.message === "Invalid email") {
        return "Invalid email";
      } else {
        return details;
      }
    }

    throw e;
  }
}
