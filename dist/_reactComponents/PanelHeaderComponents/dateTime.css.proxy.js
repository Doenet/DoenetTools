// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".bp3-html-select select {\n  padding: 0px 15px 0px 5px !important;\n}\n.bp3-timepicker-ampm-select select {\n  padding: 0px 25px 0px 5px !important;\n}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}