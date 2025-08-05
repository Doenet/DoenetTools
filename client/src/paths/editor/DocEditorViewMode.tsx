import React from "react";
import { useLoaderData } from "react-router";
import { DoenetmlVersion } from "../../types";
import { DoenetViewer } from "@doenet/doenetml-iframe";
import { BlueBanner } from "../../widgets/BlueBanner";
import axios from "axios";

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
 * This page allows you to view your document as you are editing it.
 * Context: `documentEditor`
 */
export function DocEditorViewMode() {
  const { source, doenetmlVersion } = useLoaderData() as {
    source: string;
    doenetmlVersion: DoenetmlVersion | null;
  };

  const baseUrl = window.location.host;
  const doenetViewerUrl = `${baseUrl}/activityViewer`;

  return (
    <BlueBanner>
      <DoenetViewer
        doenetML={source}
        doenetmlVersion={doenetmlVersion!.fullVersion}
        flags={{
          showCorrectness: true,
          solutionDisplayMode: "button",
          showFeedback: true,
          showHints: true,
          autoSubmit: false,
          allowLoadState: false,
          allowSaveState: false,
          allowLocalState: false,
          allowSaveEvents: false,
        }}
        attemptNumber={1}
        doenetViewerUrl={doenetViewerUrl}
        includeVariantSelector={true}
      />
    </BlueBanner>
  );
}
