import React from "react";
import { useFetcher, useLoaderData } from "react-router";
import axios from "axios";
import { Content } from "../../types";
import { CompoundActivityEditor } from "../../views/CompoundActivityEditor";

export async function loader({ params }: { params: any }) {
  const {
    data: { content },
  } = await axios.get(`/api/editor/getCompoundEditorEdit/${params.contentId}`);
  return { content };
}

/**
 * This page allows you to edit your compound activity (e.g. problem set) by renaming items or changing the ordering.
 * Context: `compoundEditor`
 */
export function CompoundEditorEditMode() {
  const { content: activity } = useLoaderData() as { content: Content };
  const fetcher = useFetcher();

  const readOnly =
    (activity.assignmentInfo?.assignmentStatus ?? "Unassigned") !==
    "Unassigned";

  return (
    <CompoundActivityEditor
      activity={activity}
      fetcher={fetcher}
      headerHeight={`${readOnly ? 120 : 80}px`}
    />
  );
}
