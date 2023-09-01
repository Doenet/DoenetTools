// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "body {\n    font-size: 14px;\n    background-color: var(--canvas);\n    font-family: \"Lato\", \"Open Sans\", sans-serif;\n    font-weight: normal;\n    line-height: 1.6em;\n    overflow: hidden;\n}\n\na {\n    text-decoration:none;\n}\n\na:hover {\n    text-decoration:underline;\n}\nbutton{\n    height:20px;\n    text-decoration:none;\n    outline-style: hidden;\n\n}\nselect{\n    height:20px;\n}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}