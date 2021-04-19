// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".drivecardContainer * {\n  box-sizing: border-box;\n  user-select: none;\n}\n\n.drivecardContainer {\n  margin: 0;\n  width: 100%;\n  justify-content: center;\n  overflow:hidden;\n}\n\n.list {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  position: relative;\n  font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto,\n    segoe ui, arial, sans-serif;\n  width: 100%;\n  padding: 15px;\n  overflow-y: scroll;\n  text-transform: uppercase;\n  font-size: 10px;\n  line-height: 10px;\n  border-radius: 4px;\n  outline:none;\n}\n.adiv {\n  /* position: absolute; */\n  will-change: transform, width, height, opacity;\n  padding: 15px;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}