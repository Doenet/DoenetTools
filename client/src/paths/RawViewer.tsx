import { DoenetViewer } from "@doenet/doenetml-iframe";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { ActivitySource, isActivitySource } from "@doenet-tools/shared";
import { Content, DoenetmlVersion } from "../types";
import { compileActivityFromContent } from "../utils/activity";
import { useEffect } from "react";
import { ActivityViewer as DoenetActivityViewer } from "@doenet/assignment-viewer";

export async function loader({ params }: any) {
  const {
    data: { activity: activityData },
  } = await axios.get(
    `/api/activityEditView/getPublicContent/${params.viewId}`,
  );

  const contentId = params.viewId;

  if (activityData.type === "singleDoc") {
    const doenetML = activityData.doenetML;
    const doenetmlVersion: DoenetmlVersion = activityData.doenetmlVersion;

    return {
      type: activityData.type,
      activityData,
      doenetML,
      doenetmlVersion,
      contentId,
    };
  } else {
    const activityJsonFromRevision = activityData.activityJson
      ? JSON.parse(activityData.activityJson)
      : null;

    const activityJson = isActivitySource(activityJsonFromRevision)
      ? activityJsonFromRevision
      : compileActivityFromContent(activityData);

    return {
      type: activityData.type,
      activityData,
      activityJson,
      contentId,
    };
  }
}

export function RawViewer() {
  const data = useLoaderData() as {
    contentId: string;
    activityData: Content;
  } & (
    | {
        type: "singleDoc";
        doenetML: string;
        doenetmlVersion: DoenetmlVersion;
      }
    | {
        type: "select" | "sequence";
        activityJson: ActivitySource;
      }
  );

  const baseUrl = window.location.protocol + "//" + window.location.host;
  const doenetViewerUrl = `${baseUrl}/view`;

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // If we have a parent, relay SPLICE and lti messages
      // between parent and window or, if singleDoc, between parent and iframe
      if (window.parent !== window) {
        // ignore any messages that aren't SPLICE or lti messages
        if (
          !event.data.subject?.startsWith("SPLICE") &&
          !event.data.subject?.startsWith("lti")
        ) {
          return;
        }

        const iframe = document.querySelector("iframe");

        // If we have a single doc, and there is no iframe, we can't proceed
        if (data.type === "singleDoc") {
          if (!iframe) {
            return;
          }
        }

        // If message originates from parent window
        if (event.source === window.parent) {
          if (data.type === "singleDoc") {
            // If we have a single doc, relay to our iframe
            iframe!.contentWindow!.postMessage(
              event.data,
              window.location.origin,
            );
          }
        } else {
          if (data.type === "singleDoc") {
            // If we have a single doc, verify message is from our iframe
            if (event.source !== iframe!.contentWindow) {
              return;
            }
          }

          window.parent.postMessage(event.data, "*");
        }
      }
    };

    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, [data]);

  if (data.type === "singleDoc") {
    return (
      <DoenetViewer
        doenetML={data.doenetML}
        doenetmlVersion={data.doenetmlVersion.fullVersion}
        attemptNumber={1}
        doenetViewerUrl={doenetViewerUrl}
        includeVariantSelector={true}
        addVirtualKeyboard={false}
      />
    );
  } else {
    const activityData = data.activityData;
    return (
      <DoenetActivityViewer
        source={data.activityJson}
        requestedVariantIndex={1}
        userId={"hi"}
        paginate={
          activityData.type === "sequence" ? activityData.paginate : false
        }
        activityLevelAttempts={
          activityData.assignmentInfo?.mode === "summative"
        }
        itemLevelAttempts={activityData.assignmentInfo?.mode === "formative"}
        maxAttemptsAllowed={activityData.assignmentInfo?.maxAttempts}
        showTitle={false}
        doenetViewerUrl={doenetViewerUrl}
        flags={{
          allowLoadState: true,
          allowSaveState: true,
          allowSaveEvents: true,
          allowSaveSubmissions: true,
        }}
      />
    );
  }
}
