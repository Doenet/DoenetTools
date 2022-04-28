import React, {useRef, useCallback, useState, useEffect} from "../../_snowpack/pkg/react.js";
import {useDrag, useGesture} from "../../_snowpack/pkg/@use-gesture/react.js";
import {useSprings, a, useSpring} from "../../_snowpack/pkg/@react-spring/web.js";
import debounce from "../../_snowpack/pkg/lodash.debounce.js";
const styles = {
  container: {display: "flex", alignItems: "center", position: "relative", overflow: "hidden", height: "100%", width: "100%"},
  item: {position: "absolute", height: "100%", willChange: "transform"},
  dotcontainer: {
    padding: "0.7rem 1rem",
    color: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  dot: {
    borderRadius: "99px",
    background: "#000",
    width: "5px",
    height: "5px",
    margin: ".3rem",
    color: "#000"
  },
  buttonsContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    display: "flex",
    alignItems: "center"
  },
  prevButton: {
    position: "absolute",
    background: "none",
    color: "#000",
    border: "none",
    marginLeft: "-30px"
  },
  nextButton: {
    marginRight: "-30px",
    position: "absolute",
    background: "none",
    color: "#000",
    border: "none",
    marginLeft: "-30px",
    right: 0
  }
};
export default function SliderContainer(props) {
  const [width, setWidth] = useState(0);
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    ref: measuredRef,
    style: {height: "100%", position: "relative"}
  }, width !== 0 ? /* @__PURE__ */ React.createElement(Slider, {
    ...props,
    itemWidth: width
  }, props.children) : "null"));
}
function Slider({fileNames, itemWidth = "full", visible = fileNames.length - 2, style, children, showButtons = true, showCounter = true, callBack}) {
  const items = fileNames.map((file) => {
    let url = `url("${file}")`;
    return {css: url};
  });
  if (items.length <= 2)
    console.warn("The slider doesn't handle two or less items very well, please use it with an array of at least 3 items in length");
  const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  let width = itemWidth === "full" ? windowWidth : Math.ceil(itemWidth);
  const idx = useCallback((x, l = items.length) => (x < 0 ? x + l : x) % l, [items]);
  const getPos = useCallback((i, firstVis, firstVisIdx) => idx(i - firstVis + firstVisIdx), [idx]);
  const offset = 0;
  const [springs, set] = useSprings(items.length, (i) => ({x: (i < items.length - 1 ? i : -1) * width + offset}));
  const prev = useRef([0, 1]);
  const index = useRef(0);
  const [active, setActive] = useState(1);
  useEffect(() => {
    callBack(active - 1);
  }, [active]);
  const runSprings = useCallback((y, vy, down, xDir, cancel, xMove) => {
    if (!down) {
      index.current += (-xMove + (width + xMove)) / width * (xDir > 0 ? -1 : 1);
    }
    if (index.current + 1 > items.length) {
      setActive(index.current % items.length + 1);
    } else if (index.current < 0) {
      setActive(items.length + (index.current + 1) % items.length);
    } else {
      setActive(index.current + 1);
    }
    const finalY = index.current * width;
    const firstVis = idx(Math.floor(finalY / width) % items.length);
    const firstVisIdx = vy < 0 ? items.length - visible - 1 : 1;
    set((i) => {
      const position = getPos(i, firstVis, firstVisIdx);
      const prevPosition = getPos(i, prev.current[0], prev.current[1]);
      let rank = firstVis - (finalY < 0 ? items.length : 0) + position - firstVisIdx + (finalY < 0 && firstVis === 0 ? items.length : 0);
      return {
        x: -finalY % (width * items.length) + width * rank + (down ? xMove : 0) + offset,
        immediate: vy < 0 ? prevPosition > position : prevPosition < position
      };
    });
    prev.current = [firstVis, firstVisIdx];
  }, [idx, getPos, width, visible, set, items.length]);
  const bind = useGesture({
    onDrag: ({offset: [x], vxvy: [vx], down, direction: [xDir], cancel, movement: [xMove]}) => {
      vx && runSprings(-x, -vx, down, xDir, cancel, xMove);
    },
    onDragEnd: (e) => {
    }
  });
  const buttons = (next) => {
    index.current += next;
    runSprings(0, next, true, -0, () => {
    }, -0);
  };
  const debounceTransition = debounce(buttons, 10);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, showButtons ? /* @__PURE__ */ React.createElement("div", {
    style: {...styles.buttonsContainer}
  }, /* @__PURE__ */ React.createElement("button", {
    style: {...styles.prevButton},
    onClick: () => debounceTransition(-1)
  }, /* @__PURE__ */ React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M16.2426 6.34317L14.8284 4.92896L7.75739 12L14.8285 19.0711L16.2427 17.6569L10.5858 12L16.2426 6.34317Z",
    fill: "currentColor"
  }))), /* @__PURE__ */ React.createElement("button", {
    style: {...styles.nextButton},
    onClick: () => debounceTransition(1)
  }, /* @__PURE__ */ React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M10.5858 6.34317L12 4.92896L19.0711 12L12 19.0711L10.5858 17.6569L16.2427 12L10.5858 6.34317Z",
    fill: "currentColor"
  })))) : null, /* @__PURE__ */ React.createElement("div", {
    ...bind(),
    style: {...style, ...styles.container}
  }, springs.map(({x, vel}, i) => /* @__PURE__ */ React.createElement(a.div, {
    key: i,
    style: {...styles.item, width, x},
    children: children(items[i], i)
  }))), showCounter ? /* @__PURE__ */ React.createElement(InstaCounter, {
    currentIndex: active,
    data: items
  }) : null);
}
function InstaCounter({currentIndex, data}) {
  const dots = [];
  for (const [index] of data.entries()) {
    dots.push(/* @__PURE__ */ React.createElement(Dot, {
      key: index,
      active: currentIndex - 1 === index
    }));
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: {...styles.navigation}
  }, /* @__PURE__ */ React.createElement("div", {
    style: {...styles.dotcontainer}
  }, dots));
}
function Dot({active}) {
  const {transform, opacity} = useSpring({
    opacity: active ? 1 : 0.8,
    transform: active ? `scale(1.5)` : `scale(1)`,
    config: {mass: 5, tension: 500, friction: 80}
  });
  return /* @__PURE__ */ React.createElement(a.div, {
    style: {opacity: opacity.to((o) => o), transform, ...styles.dot}
  });
}
