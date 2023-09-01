// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "/* SECTION: BASIC STYLES */\n.switch {\n  font-size: 18px;\n  font-family: sans-serif;\n}\n\n.switch label {\n  position: relative;\n  display: inline-flex;\n  width: 2.5em;\n  min-height: 1em;\n  vertical-align: top;\n  isolation: isolate;\n  align-items: flex-start;\n  cursor: pointer;\n  margin-right: 1em;\n}\n\n.switch input {\n  position: absolute;\n  opacity: 0;\n  box-sizing: border-box;\n  height: 1em;\n  width: 3em;\n  color: var(--canvastext);\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.switch-visual {\n  position: relative;\n  display: flex;\n  cursor: pointer;\n  width: 2em;\n  background-color: var(--mainGray);\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n  border-radius: 1em;\n  border-width: 0.5em;\n  order: 0;\n}\n\n.switch-visual::before {\n  content: '';\n  height: 1em;\n  width: 1em;\n  left: 0;\n  bottom: 0;\n  background-color: var(--canvas);\n  -webkit-transition: 0.4s;\n  transition: 0.4s;\n  border-radius: 50%;\n}\n\ninput:checked + .switch-visual {\n  background-color: var(--mainBlue);\n}\n\ninput:focus + .switch-visual {\n  box-shadow: 0 0 1px var(--mainBlue);\n}\n\ninput:checked + .switch-visual:before {\n  -webkit-transform: translateX(1em);\n  -ms-transform: translateX(1em);\n  transform: translateX(1em);\n}\n\n.switch-text {\n  display: block;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}