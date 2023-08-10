import React, { useState, useRef, useEffect } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import Button from "../../_reactComponents/PanelHeaderComponents/Button";
import VisibilitySensor from "react-visibility-sensor-v2";
import { DoenetML } from "../DoenetML";
import { Box, HStack } from "@chakra-ui/react";
import VariantSelect from "../../Tools/_framework/ChakraBasedComponents/VariantSelect";

export default React.memo(function CodeViewer(props) {
  let { name, id, SVs, children, actions, callAction } = useDoenetRenderer(
    props,
    false,
  );

  const [variants, setVariants] = useState({
    index: 1,
    numVariants: 1,
    allPossibleVariants: ["a"],
  });

  let onChangeVisibility = (isVisible) => {
    callAction({
      action: actions.recordVisibilityChange,
      args: { isVisible },
    });
  };

  useEffect(() => {
    return () => {
      callAction({
        action: actions.recordVisibilityChange,
        args: { isVisible: false },
      });
    };
  }, []);

  if (SVs.hidden) {
    return null;
  }
  let viewerHeight = { ...SVs.height };
  viewerHeight.size = viewerHeight.size - 40;

  let viewerWidth = { ...SVs.width };
  viewerWidth.size = viewerWidth.size - 4;

  let surroundingBoxStyle = {
    width: sizeToCSS(SVs.width),
    maxWidth: "100%",
  };

  if (SVs.locationFromParent !== "bottom") {
    surroundingBoxStyle.border = "var(--mainBorder)";
    surroundingBoxStyle.borderRadius = "var(--mainBorderRadius)";
  }

  let contentPanel = (
    <div
      style={{
        width: sizeToCSS(SVs.width),
        height: sizeToCSS(SVs.height),
        maxWidth: "100%",
        // padding: "12px",
        // border: "1px solid black",
        // overflowY: "scroll"
        boxSizing: "border-box",
        paddingLeft: "10px",
      }}
    >
      <div style={{ height: "28px" }}>
        <HStack>
          <Button
            onClick={() => callAction({ action: actions.updateComponents })}
            value="update"
            id={id + "_updateButton"}
            style={{ marginTop: "10px" }}
          ></Button>
          {variants.numVariants > 1 && (
            <Box h="32px" width="100%">
              <VariantSelect
                size="sm"
                menuWidth="140px"
                array={variants.allPossibleVariants}
                syncIndex={variants.index}
                onChange={(index) =>
                  setVariants((prev) => {
                    let next = { ...prev };
                    next.index = index + 1;
                    return next;
                  })
                }
              />
            </Box>
          )}
        </HStack>
      </div>
      <div
        style={{
          overflowY: "scroll",
          width: sizeToCSS(viewerWidth),
          maxWidth: "100%",
          height: sizeToCSS(viewerHeight),
          paddingRight: "10px",
          marginTop: "10px",
          boxSizing: "border-box",
        }}
        id={id + "_content"}
      >
        <DoenetML
          doenetML={SVs.doenetML}
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
          activityId={id}
          generatedVariantCallback={setVariants}
          requestedVariantIndex={variants.index}
        />
      </div>
    </div>
  );

  let outerStyle = {};
  if (SVs.locationFromParent !== "bottom") {
    outerStyle = { margin: "12px 0" };
  }

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <div style={outerStyle}>
        <a name={id} />
        <div
          style={surroundingBoxStyle}
          className="codeViewerSurroundingBox"
          id={id}
        >
          {contentPanel}
        </div>
      </div>
    </VisibilitySensor>
  );
});
