import { formatTime } from "./dateUtilityFunction";
import { Content } from "../types";

export function formatAssignmentBlurb(content: Content) {
  if (
    content.type === "folder" ||
    !content.assignmentInfo?.assignmentStatus ||
    content.assignmentInfo?.assignmentStatus === "Unassigned"
  ) {
    return "";
  }

  const status = content.assignmentInfo.assignmentStatus;
  const closeTime = content.assignmentInfo.codeValidUntil
    ? formatTime(content.assignmentInfo.codeValidUntil)
    : null;
  if (status === "Open" && closeTime) {
    return `Open until ${closeTime}`;
  } else {
    return status as string;
  }
}
