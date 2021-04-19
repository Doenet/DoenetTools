// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".button {\n    height: 40px;\n    margin: 50px;\n    border-radius: 5px;\n    background-color: white;\n  }\n\n.align {\n    height: 500px;\n    width: auto;\n    padding: 50px;\n}\n\n  .donut-main{\n    position: relative;\n    animation: donutMove 14s ease alternate infinite;\n  }\n  \n  @keyframes donutMove {\n    from {\n        transform: translate(0px);\n    }\n    50% {\n        transform: translate(900px);\n    }\n    to {\n        transform: translate(0px);\n    }\n}\n\n.donut-scale{\n    position: relative;\n    animation: donutScale 1s linear infinite alternate;\n}\n\n@keyframes donutScale {\n    from {\n        transform: scale(0);\n    }\n    to {\n        transform: scale(1.5);\n    }\n}";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}