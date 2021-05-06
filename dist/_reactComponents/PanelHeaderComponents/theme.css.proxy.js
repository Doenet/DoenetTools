// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".doenetComponentBackgroundInactive {\n    color: #E2E2E2;\n}\n\n.doenetComponentForegroundInactive {\n    color: #3d3d3d;\n}\n\n.doenetComponentBackgroundActive {\n    color: #288ae9;\n}\n\n.doenetComponentForegroundActive {\n    color: #1a5a99;\n}\n\n.noselect {\n    -webkit-touch-callout: none; /* iOS Safari */\n      -webkit-user-select: none; /* Safari */\n       -khtml-user-select: none; /* Konqueror HTML */\n         -moz-user-select: none; /* Old versions of Firefox */\n          -ms-user-select: none; /* Internet Explorer/Edge */\n              user-select: none; /* Non-prefixed version, currently\n                                    supported by Chrome, Edge, Opera and Firefox */\n  }";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}