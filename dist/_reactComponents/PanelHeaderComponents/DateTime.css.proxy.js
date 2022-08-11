// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".rdtPicker {\n  margin-left: var(--menuPanelMargin, 0px);\n}\n\n.form-control {\n  border: var(--mainBorder);\n  border-radius: var(--mainBorderRadius);\n  height: 18px;\n  width: 170px;\n}\n\n.rdtPicker td.rdtActive,\n.rdtPicker td.rdtActive:hover {\n  background-color: var(--mainBlue);\n}\n\n.form-control:focus {\n  outline: 2px solid var(--canvastext);\n  outline-offset: 2px;\n}\n\n.rdtPicker td.rdtToday:before {\n  border-bottom: 7px solid var(--mainBlue);\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}