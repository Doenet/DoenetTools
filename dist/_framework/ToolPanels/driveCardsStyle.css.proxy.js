// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".driveCardList {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    margin-top: 6px;\n  }\n  \n  .driveCardList > div {\n    position: absolute;\n    will-change: transform, width, height, opacity;\n  }\n  \n  .driveCardList > div > div > div {\n    position: relative;\n    /* background-size: cover;\n    background-position: center center; */\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n  }\n  ";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}