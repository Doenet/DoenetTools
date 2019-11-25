import SectioningComponent from './abstract/SectioningComponent';

export class Section extends SectioningComponent {
  static componentType = "section";

  updateState(args={}) {
    super.updateState(args);

    this.state.level = 1;
  }
}

export class Subsection extends SectioningComponent {
  static componentType = "subsection";

  updateState(args={}) {
    super.updateState(args);

    this.state.level = 2;
  }
}

export class Subsubsection extends SectioningComponent {
  static componentType = "subsubsection";

  updateState(args={}) {
    super.updateState(args);

    this.state.level = 3;
  }
}

export class Paragraphs extends SectioningComponent {
  static componentType = "paragraphs";

  updateState(args={}) {
    super.updateState(args);

    this.state.level = 4;
  }
}

export class Aside extends SectioningComponent {
  static componentType = "aside";

  updateState(args={}) {
    super.updateState(args);

    this.state.level = 3;
    this.state.containerTag = "aside";
    
  }
}