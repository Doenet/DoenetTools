// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".rdtPicker {\n  min-width: 0px;\n  width: 175px;\n}\n\n.form-control {\n  border: 2px solid black;\n  border-radius: 5px;\n  height: 18px;\n  width: 177px;\n}\n\n.rdtPicker td.rdtActive,\n.rdtPicker td.rdtActive:hover {\n  background-color: #1a5a99;\n}\n\n.rdtPicker td.rdtToday:before {\n  border-bottom: 7px solid #1a5a99;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}