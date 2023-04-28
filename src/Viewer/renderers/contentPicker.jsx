import React, { useRef, useState } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import VisibilitySensor from "react-visibility-sensor-v2";
import { useEffect } from "react";
import { rendererState } from "../useDoenetRenderer";
import { useSetRecoilState } from "recoil";

export default React.memo(function ContentPicker(props) {
  let {
    name,
    id,
    SVs,
    children,
    actions,
    ignoreUpdate,
    rendererName,
    callAction,
  } = useDoenetRenderer(props);

  ContentPicker.baseStateVariable = "selectedIndices";

  const [rendererSelectedIndices, setRendererSelectedIndices] = useState(
    SVs.selectedIndices,
  );

  const setRendererState = useSetRecoilState(rendererState(rendererName));

  let selectedIndicesWhenSetState = useRef(null);

  if (
    !ignoreUpdate &&
    selectedIndicesWhenSetState.current !== SVs.selectedIndices
  ) {
    setRendererSelectedIndices(SVs.selectedIndices);
    selectedIndicesWhenSetState.current = SVs.selectedIndices;
  } else {
    selectedIndicesWhenSetState.current = null;
  }

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

  function onChangeHandler(e) {
    let newSelectedIndices = [];

    if (e.target.value) {
      newSelectedIndices = Array.from(e.target.selectedOptions, (option) =>
        Number(option.value),
      );
    }

    if (
      rendererSelectedIndices.length !== newSelectedIndices.length ||
      rendererSelectedIndices.some((v, i) => v != newSelectedIndices[i])
    ) {
      setRendererSelectedIndices(newSelectedIndices);
      selectedIndicesWhenSetState.current = SVs.selectedIndices;

      setRendererState((was) => {
        let newObj = { ...was };
        newObj.ignoreUpdate = true;
        return newObj;
      });

      callAction({
        action: actions.updateSelectedIndices,
        args: {
          selectedIndices: newSelectedIndices,
        },
        baseVariableValue: newSelectedIndices,
      });
    }
  }

  if (SVs.hidden) {
    return null;
  }

  let pickers = [];

  if (SVs.separateByTopic) {
    for (let topic in SVs.childrenByTopic) {
      let childIndices = SVs.childrenByTopic[topic];

      let optionsList = childIndices.map(function (ind) {
        return (
          <option key={ind + 1} value={ind + 1}>
            {SVs.childInfo[ind].title}
          </option>
        );
      });

      let value = rendererSelectedIndices[0];

      if (value === undefined || !childIndices.includes(value)) {
        value == "";
      }

      pickers.push(
        <p key={topic}>
          <label>
            {topic}:{" "}
            <select
              className="custom-select"
              id={id + topic}
              onChange={(e) => onChangeHandler(e)}
              value={value}
              disabled={SVs.disabled}
            >
              <option hidden={true} value=""></option>
              {optionsList}
            </select>
          </label>
        </p>,
      );
    }
  } else {
    let optionsList = SVs.childInfo.map(function (obj, ind) {
      return (
        <option key={ind + 1} value={ind + 1}>
          {obj.title}
        </option>
      );
    });

    let value = rendererSelectedIndices[0];

    if (value === undefined) {
      value == "";
    }

    pickers.push(
      <p>
        <label>
          {SVs.label}:{" "}
          <select
            className="custom-select"
            id={id + "select"}
            onChange={(e) => onChangeHandler(e)}
            value={value}
            disabled={SVs.disabled}
          >
            <option hidden={true} value=""></option>
            {optionsList}
          </select>
        </label>
      </p>,
    );
  }

  return (
    <VisibilitySensor partialVisibility={true} onChange={onChangeVisibility}>
      <section id={id}>
        <a name={id} />
        {pickers}
        {children}
      </section>
    </VisibilitySensor>
  );
});
