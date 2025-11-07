import React, { useCallback, useEffect, useRef } from "react";
import { useLoaderData, useOutletContext } from "react-router";
import { DoenetmlVersion } from "../../types";
import { DoenetEditor } from "@doenet/doenetml-iframe";
import axios, { AxiosError } from "axios";
import { EditorContext } from "./EditorHeader";

export async function loader({ params }: { params: any }) {
  const {
    data: { source, doenetmlVersion },
  } = await axios.get(`/api/editor/getDocEditorDoenetML/${params.contentId}`);

  return {
    source,
    doenetmlVersion,
  };
}

/**
 * This page allows you to edit your doenetml and save it to the server.
 * Context: `documentEditor`
 */
export function DocEditorEditMode() {
  const { contentId, assignmentStatus } = useOutletContext<EditorContext>();
  const readOnly = assignmentStatus !== "Unassigned";

  const { source, doenetmlVersion } = useLoaderData() as {
    source: string;
    doenetmlVersion: DoenetmlVersion;
  };

  return (
    <DocumentEditor
      contentId={contentId}
      source={source}
      readOnly={readOnly}
      doenetmlVersion={doenetmlVersion}
    />
  );
}

function DocumentEditor({
  contentId,
  source,
  readOnly,
  doenetmlVersion,
}: {
  contentId: string;
  source: string;
  readOnly: boolean;
  doenetmlVersion: DoenetmlVersion;
}) {
  const textEditorDoenetML = useRef(source);
  const savedDoenetML = useRef(source);

  const numVariants = useRef(1);
  const documentStructureChanged = useRef(false);

  // const readOnly =
  //   doc.assignmentInfo?.assignmentStatus ?? "Unassigned" !== "Unassigned";
  const readOnlyRef = useRef(readOnly);
  readOnlyRef.current = readOnly;

  const contentIdRef = useRef(contentId);
  contentIdRef.current = contentId;

  const headerHeight = `${readOnly ? 120 : 80}px`;

  const initialWarnings = doenetmlVersion.deprecated
    ? [
        {
          level: 1,
          message: `DoenetML version
            ${doenetmlVersion.displayedVersion} is deprecated.
            ${doenetmlVersion.deprecationMessage}`,
          doenetMLrange: {},
        },
      ]
    : [];

  const inTheMiddleOfSaving = useRef(false);
  const postponedSaving = useRef(false);
  const hasInitiallyRendered = useRef(false);
  const isMounted = useRef(true);

  /**
   * Saves the current DoenetML content to the server.
   *
   * IFRAME PERSISTENCE ISSUE MITIGATION:
   * This function implements a 3-layer defense against duplicate saves caused by
   * DoenetEditor iframe persistence during React Router navigation:
   *
   * Layer 1 (React Key): <DoenetEditor key={contentId} />
   * Try to force React to remount
   * the iframe when contentId changes, encouraging proper cleanup.
   * It doesn't - this is probably a bug with <DoenetEditor>
   *
   * Layer 2 (Component Mount State): isMounted.current tracks if this component
   * instance is still active. Prevents saves from components that have unmounted
   * but whose iframes are still sending callbacks.
   *
   * Layer 3 (ContentId Validation): contentIdRef.current ensures we're saving
   * with the most recent contentId, even if the callback was triggered by a
   * stale iframe from a previous page.
   *
   * ROOT CAUSE: DoenetEditor is an iframe component that hangs around and keeps
   * sending callbacks even when we navigate to a different page. This creates an
   * issues where two different iframes (from different pages) are both active
   * at the same time, and saving the state to two different contentIds.
   * While the key prop encourages proper iframe lifecycle, it doesn't
   * guarantee immediate cleanup, so the additional validation layers provide
   * defensive programming.
   *
   * NOTE: This approach mitigates symptoms rather than fixing the underlying
   * iframe unmounting issue. A true fix would require DoenetEditor to properly
   * clean up its iframe callbacks on unmount.
   */
  const handleSaveDoc = useCallback(async () => {
    // Layer 2: Prevent saves from unmounted components
    if (!isMounted.current) {
      return;
    }

    if (
      readOnlyRef.current ||
      (savedDoenetML.current === textEditorDoenetML.current &&
        !documentStructureChanged.current)
    ) {
      // do not attempt to save doenetml if assigned
      return;
    }

    const newDoenetML = textEditorDoenetML.current;
    if (inTheMiddleOfSaving.current) {
      postponedSaving.current = true;
    } else {
      inTheMiddleOfSaving.current = true;

      //Save in localStorage
      // localStorage.setItem(cid,doenetML)

      try {
        const params = {
          doenetML: newDoenetML,
          contentId: contentIdRef.current,
          numVariants: numVariants.current,
        };
        await axios.post("/api/updateContent/saveDoenetML", params);
        savedDoenetML.current = newDoenetML;
        documentStructureChanged.current = false;
      } catch (error) {
        if (error instanceof AxiosError) {
          alert(error.message);
        }
      }

      inTheMiddleOfSaving.current = false;

      //If we postponed then potentially
      //some changes were saved again while we were saving
      //so save again
      if (postponedSaving.current) {
        postponedSaving.current = false;
        handleSaveDoc();
      }
    }
  }, []);

  // save draft when leave page
  useEffect(() => {
    return () => {
      // Layer 2: Mark component as unmounted
      isMounted.current = false;
      handleSaveDoc();
    };
  }, [handleSaveDoc]);

  const baseUrl = window.location.protocol + "//" + window.location.host;
  const doenetViewerUrl = `${baseUrl}/activityViewer`;

  return (
    <DoenetEditor
      key={contentId} // Force remount when contentId changes to fix iframe persistence
      height={`calc(100vh - ${headerHeight})`}
      width="100%"
      doenetML={textEditorDoenetML.current}
      doenetmlChangeCallback={() => {
        // BUG on DoenetML: This callback is supposed to be called when doenetml saves, but it is also called
        // when doenet ml first renders
        // See https://github.com/Doenet/DoenetML/issues/525

        // Layer 3: Validate contentId matches current component
        if (contentId !== contentIdRef.current) {
          return;
        }

        // Skip the first call which happens on initial render
        if (!hasInitiallyRendered.current) {
          hasInitiallyRendered.current = true;
          return;
        }

        handleSaveDoc();
      }}
      immediateDoenetmlChangeCallback={(newDoenetML: string) => {
        textEditorDoenetML.current = newDoenetML;
      }}
      documentStructureCallback={(x: any) => {
        if (Array.isArray(x.args?.allPossibleVariants)) {
          numVariants.current = x.args.allPossibleVariants.length;
        }
        documentStructureChanged.current = true;
      }}
      doenetmlVersion={doenetmlVersion.fullVersion}
      initialWarnings={initialWarnings}
      border="none"
      readOnly={readOnly}
      doenetViewerUrl={doenetViewerUrl}
    />
  );
}
