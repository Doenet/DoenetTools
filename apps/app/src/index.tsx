import {
  ActionFunctionArgs,
  createBrowserRouter,
  redirect,
  replace,
  RouterProvider,
} from "react-router";
import { createRoot } from "react-dom/client";

import "@doenet/doenetml-iframe/style.css";
import "./styles/mathjax-menu.css";

import { MathJaxContext } from "better-react-mathjax";
import { theme } from "./theme";
import { loader as exploreLoader, Explore } from "./paths/Explore";

import { loader as curateLoader, Curate } from "./paths/Curate";

import { loader as siteLoader, SiteHeader } from "./paths/SiteHeader";
import { loader as carouselLoader, Home } from "./paths/Home";

import { loader as activitiesLoader, Activities } from "./paths/Activities";
import {
  loader as sharedActivitiesLoader,
  SharedActivities,
} from "./paths/SharedActivities";
import { loader as assignedLoader, Assigned } from "./paths/Assigned";
import {
  loader as assignmentResponseOverviewLoader,
  AssignmentData as AssignmentResponseOverview,
} from "./paths/AssignmentResponseOverview";
import {
  action as enterClassCodeAction,
  EnterClassCode,
} from "./paths/EnterClassCode";
import { loader as studentsLoader, Students } from "./paths/Students";
import {
  loader as studentAssignmentScoresLoader,
  StudentAssignmentScores,
  assignedDataloader,
} from "./paths/StudentAssignmentScores";
import { loader as trashLoader, Trash } from "./paths/Trash";
import { ChakraProvider } from "@chakra-ui/react";
import { FolderContext } from "./paths/FolderContext";

import ErrorPage from "./paths/ErrorPage";

import "@fontsource/jost";
import {
  loader as editorHeaderLoader,
  EditorHeader,
} from "./paths/editor/EditorHeader";
import { SignIn, action as signInAction } from "./paths/SignIn";
import {
  ConfirmSignIn,
  loader as confirmSignInLoader,
} from "./paths/ConfirmSignIn";
import {
  ChangeName,
  loader as changeNameLoader,
  action as changeNameAction,
} from "./paths/ChangeName";
import {
  LibraryActivities,
  loader as libraryActivitiesLoader,
} from "./paths/LibraryActivities";
import {
  CompoundEditorViewMode,
  loader as compoundEditorViewModeLoader,
} from "./paths/editor/CompoundEditorViewMode";
import {
  CompoundEditorEditMode,
  loader as compoundEditorEditModeLoader,
} from "./paths/editor/CompoundEditorEditMode";
import {
  EditorSettingsMode,
  loader as docEditorSettingsModeLoader,
} from "./paths/editor/EditorSettingsMode";
import axios, { AxiosError } from "axios";
import { loadShareStatus } from "./popups/ShareMyContentModal";
import {
  DocEditorRemixMode,
  loader as docEditorRemixModeLoader,
} from "./paths/editor/DocEditorRemixMode";
import {
  EditorLibraryMode,
  loader as editorLibraryModeLoader,
} from "./paths/editor/EditorLibraryMode";
import {
  SharedWithMe,
  loader as sharedWithMeLoader,
} from "./paths/SharedWithMe";
import { editorUrl } from "./utils/url";
import { About } from "./paths/About";
import { GetInvolved } from "./paths/GetInvolved";
import { Events } from "./paths/Events";
import { QuickLinks } from "./paths/QuickLinks";
import { mathjaxConfig } from "./utils/mathjaxConfig";

async function loadActivityViewerRoute() {
  const route = await import("./paths/ActivityViewer");
  return { loader: route.loader, Component: route.ActivityViewer };
}

async function loadAssignmentResponseStudentRoute() {
  const route = await import("./paths/AssignmentResponseStudent");
  return { loader: route.loader, Component: route.AssignmentResponseStudent };
}

async function loadAssignmentViewerRoute() {
  const route = await import("./paths/AssignmentViewer");
  return {
    loader: route.loader,
    action: route.action,
    Component: route.AssignmentViewer,
  };
}

async function loadDoenetMLComparisonRoute() {
  const route = await import("./paths/DoenetMLComparison");
  return {
    loader: route.loader,
    action: route.action,
    Component: route.DoenetMLComparison,
  };
}

async function loadDocEditorEditModeRoute() {
  const route = await import("./paths/editor/DocEditorEditMode");
  return { loader: route.loader, Component: route.DocEditorEditMode };
}

async function loadDocEditorViewModeRoute() {
  const route = await import("./paths/editor/DocEditorViewMode");
  return { loader: route.loader, Component: route.DocEditorViewMode };
}

async function loadDocEditorHistoryModeRoute() {
  const route = await import("./paths/editor/DocEditorHistoryMode");
  return { loader: route.loader, Component: route.DocEditorHistoryMode };
}

async function loadScratchPadRoute() {
  const route = await import("./paths/ScratchPad");
  return { loader: route.loader, Component: route.ScratchPad };
}

async function loadRawViewerRoute() {
  const route = await import("./paths/RawViewer");
  return { loader: route.loader, Component: route.RawViewer };
}

const router = createBrowserRouter([
  {
    path: "/",
    loader: siteLoader,
    element: (
      <>
        <ChakraProvider theme={theme}>
          <MathJaxContext
            version={4}
            config={mathjaxConfig}
            src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js"
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
        action: genericAction,
        errorElement: <ErrorPage />,
        element: <Home />,
      },
      {
        path: "explore/:systemId?/:categoryId?/:subCategoryId?/:classificationId?",
        loader: exploreLoader,
        action: genericAction,
        element: <Explore />,
        errorElement: <ErrorPage />,
      },
      {
        path: "about",
        element: <About />,
        errorElement: <ErrorPage />,
      },
      {
        path: "get-involved",
        element: <GetInvolved />,
        errorElement: <ErrorPage />,
      },
      {
        path: "events",
        element: <Events />,
        errorElement: <ErrorPage />,
      },
      {
        path: "links",
        element: <QuickLinks />,
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
        action: genericAction,
        element: <LibraryActivities />,
        errorElement: <ErrorPage />,
      },
      {
        path: "",
        element: <FolderContext />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "activities/:userId/:parentId?",
            loader: activitiesLoader,
            action: genericAction,
            element: <Activities />,
            errorElement: <ErrorPage />,
          },
          {
            path: "sharedWithMe/:userId",
            loader: sharedWithMeLoader,
            action: genericAction,
            element: <SharedWithMe />,
            errorElement: <ErrorPage />,
          },
          {
            path: "trash",
            loader: trashLoader,
            action: genericAction,
            element: <Trash />,
            errorElement: <ErrorPage />,
          },
          {
            path: "students/:parentId",
            loader: studentsLoader,
            action: genericAction,
            element: <Students />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: "sharedActivities/:ownerId/:parentId?",
        loader: sharedActivitiesLoader,
        action: genericAction,
        element: <SharedActivities />,
        errorElement: <ErrorPage />,
      },
      {
        path: "activityViewer/:contentId",
        lazy: loadActivityViewerRoute,
        action: genericAction,
        errorElement: <ErrorPage />,
      },
      {
        path: "documentEditor/:contentId",
        loader: editorHeaderLoader,
        action: genericAction,
        element: <EditorHeader />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "edit",
            lazy: loadDocEditorEditModeRoute,
            errorElement: <ErrorPage />,
          },
          {
            path: "view",
            lazy: loadDocEditorViewModeRoute,
            errorElement: <ErrorPage />,
          },
          {
            path: "settings",
            loader: docEditorSettingsModeLoader,
            action: genericAction,
            element: <EditorSettingsMode />,
            errorElement: <ErrorPage />,
          },
          {
            path: "history",
            lazy: loadDocEditorHistoryModeRoute,
            action: genericAction,
            errorElement: <ErrorPage />,
          },
          {
            path: "remixes",
            loader: docEditorRemixModeLoader,
            action: genericAction,
            element: <DocEditorRemixMode />,
            errorElement: <ErrorPage />,
          },
          {
            path: "library",
            loader: editorLibraryModeLoader,
            action: genericAction,
            element: <EditorLibraryMode />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: "compoundEditor/:contentId",
        loader: editorHeaderLoader,
        action: genericAction,
        element: <EditorHeader />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "edit",
            loader: compoundEditorEditModeLoader,
            action: genericAction,
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
            action: genericAction,
            element: <EditorSettingsMode />,
            errorElement: <ErrorPage />,
          },
          {
            path: "remixes",
            loader: docEditorRemixModeLoader,
            action: genericAction,
            element: <DocEditorRemixMode />,
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: "activityCompare/:contentId/:compareId",
        lazy: loadDoenetMLComparisonRoute,
        errorElement: <ErrorPage />,
      },
      {
        path: "assigned",
        // no actions on this page
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
        lazy: loadAssignmentResponseStudentRoute,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentData/:contentId",
        loader: assignmentResponseOverviewLoader,
        action: genericAction,
        element: <AssignmentResponseOverview />,
        errorElement: <ErrorPage />,
      },
      {
        path: "assignmentData/:contentId/:studentUserId",
        lazy: loadAssignmentResponseStudentRoute,
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
        lazy: loadAssignmentViewerRoute,
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
        // no actions on this page
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
      {
        path: "scratchPad",
        lazy: loadScratchPadRoute,
        action: genericAction,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/embed/:viewId",
    lazy: loadRawViewerRoute,
    errorElement: (
      <ChakraProvider theme={theme}>
        <ErrorPage />
      </ChakraProvider>
    ),
  },
]);

const root = createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={router} />);

/**
 * A generic action handler for React Router pages
 * 1. Takes in an action of type `application/json` (not the default `multipart/form-data`)
 * 2. Calls the endpoint specified by `path` field, passing the others field as the POST body
 * 3. Returns the results
 *
 * Special case: redirect to new page. Triggered if `redirectOnSuccess`, `replaceOnSuccess`, or `redirectNewContentId` is included.
 *
 * Special case: the route `shareContent`. Handle invalid email address.
 *
 */
async function genericAction({ request }: ActionFunctionArgs) {
  // TODO: DESIGN: Should this function only return the data portion of the response?
  // Currently this function returns entire http response. It comes down to a question
  // of whether pages/fetchers should have access to status information.
  const {
    path,
    redirectOnSuccess,
    replaceOnSuccess,
    redirectNewContentId,
    ...body
  } = await request.json();

  try {
    const results = await axios.post(`/api/${path}`, body);

    if (redirectNewContentId) {
      const newContentId: string = results.data.contentId;
      return redirect(editorUrl(newContentId, body.contentType));
    } else if (replaceOnSuccess) {
      return replace(replaceOnSuccess);
    } else if (redirectOnSuccess) {
      return redirect(redirectOnSuccess);
    } else {
      return results;
    }
  } catch (e) {
    if (path === "share/shareContent" && e instanceof AxiosError) {
      /**
       * Special case: sharing content with specific people by email address
       * Normally, when the server returns an error, we want to go the error page.
       * However, in this case, it might mean that the owner entered an invalid email address.
       * If that's the case, catch it and let the route deal with it (handled in component EditorHeader).
       */
      const error = e.response!.data!.error;
      const details = e.response!.data!.details;
      if (error === "Invalid data" && details[0]?.message === "Invalid email") {
        return "Invalid email";
      } else {
        return details;
      }
    } else if (path === "copyMove/copyContent" && e instanceof AxiosError) {
      /**
       * Special case: copying content into a descendant of itself.
       * This could occur when copying a selected folder into the list of recent destinations.
       * We don't want to go to the error page in this case but show a message in the copy modal instead.
       */
      const error = e.response!.data!.error;
      const details = e.response!.data!.details;

      if (
        error === "Invalid request" &&
        details === "Cannot copy content into a descendant of itself"
      ) {
        return { success: false, message: details };
      }
    }

    throw e;
  }
}
