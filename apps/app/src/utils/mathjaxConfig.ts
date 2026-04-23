export const mathjaxConfig = {
  tex: {
    tags: "ams",
    macros: {
      lt: "<",
      gt: ">",
      amp: "&",
      var: ["\\mathrm{#1}", 1],
      csch: "\\operatorname{csch}",
      sech: "\\operatorname{sech}",
      erf: "\\operatorname{erf}",
    },
    displayMath: [["\\[", "\\]"]],
  },
  output: {
    displayOverflow: "linebreak",
  },
};
