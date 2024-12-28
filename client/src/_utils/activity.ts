import { TbPuzzle } from "react-icons/tb";
import { MdOutlineOndemandVideo, MdOutlineSwipeLeft } from "react-icons/md";

export const activityFeatures = {
  isQuestion: {
    icon: TbPuzzle,
    term: "Single question",
    description:
      "Activity is a single question suitable to add to an assessment.",
  },
  isInteractive: {
    icon: MdOutlineSwipeLeft,
    term: "Interactive",
    description:
      "Activity contains interactives, such as interactive graphics.",
  },
  containsVideo: {
    icon: MdOutlineOndemandVideo,
    term: "Video",
    description: "Activity contains videos.",
  },
};
