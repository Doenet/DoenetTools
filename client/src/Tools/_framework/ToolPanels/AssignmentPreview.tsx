import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { DoenetViewer } from "@doenet/doenetml-iframe";
import { useLocation, useNavigate } from "react-router";

export default function AssignmentPreview({
  doenetML,
  doenetmlVersion,
  active = true,
  maxHeight = 600,
}) {
  const [variants, setVariants] = useState({
    index: 1,
    numVariants: 1,
    allPossibleVariants: ["a"],
  });

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      background="var(--canvas)"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="doenet.mediumGray"
      width="100%"
      overflow="scroll"
      maxHeight={maxHeight}
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
          idsIncludeContentId={false}
          paginate={true}
          location={location}
          navigate={navigate}
          linkSettings={{
            viewURL: "/activityViewer",
            editURL: "/codeViewer",
          }}
          showAnswerTitles={true}
        />
      ) : null}
    </Box>
  );
}
