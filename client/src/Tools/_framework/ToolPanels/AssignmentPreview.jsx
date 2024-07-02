import { Box } from "@chakra-ui/react";
import { DoenetViewer } from "@doenet/doenetml-iframe";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function AssignmentPreview({
  doenetML,
  doenetmlVersion,
  active = true,
}) {
  const [variants, setVariants] = useState({
    index: 1,
    numVariants: 1,
    allPossibleVariants: ["a"],
  });

  let navigate = useNavigate();
  let location = useLocation();

  return (
    <Box
      background="var(--canvas)"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="doenet.mediumGray"
      width="100%"
      overflow="scroll"
      maxHeight={600}
    >
      {active ? (
        <DoenetViewer
          doenetML={doenetML}
          doenetmlVersion={doenetmlVersion}
          flags={{
            showCorrectness: true,
            solutionDisplayMode: "button",
            showFeedback: true,
            showHints: true,
            autoSubmit: false,
            allowLoadState: false,
            allowSaveState: false,
            allowLocalState: false,
            allowSaveSubmissions: false,
            allowSaveEvents: false,
          }}
          attemptNumber={1}
          generatedVariantCallback={setVariants}
          requestedVariantIndex={variants.index}
          idsIncludeActivityId={false}
          paginate={true}
          location={location}
          navigate={navigate}
          linkSettings={{
            viewURL: "/activityViewer",
            editURL: "/publicEditor",
          }}
          showAnswerTitles={true}
        />
      ) : null}
    </Box>
  );
}
