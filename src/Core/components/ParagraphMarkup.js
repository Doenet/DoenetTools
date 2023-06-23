import InlineRenderInlineChildren from "./abstract/InlineRenderInlineChildren";

export class Em extends InlineRenderInlineChildren {
  static componentType = "em";
}

export class Alert extends InlineRenderInlineChildren {
  static componentType = "alert";
}

export class Q extends InlineRenderInlineChildren {
  static componentType = "q";
  static beginTextDelimiter = '"';
  static endTextDelimiter = '"';
}

export class SQ extends InlineRenderInlineChildren {
  static componentType = "sq";
  static beginTextDelimiter = "'";
  static endTextDelimiter = "'";
}

export class Term extends InlineRenderInlineChildren {
  static componentType = "term";
  static rendererType = "alert";
}

export class C extends InlineRenderInlineChildren {
  static componentType = "c";
}

export class Tag extends InlineRenderInlineChildren {
  static componentType = "tag";
  static rendererType = "tag";
  static beginTextDelimiter = "<";
  static endTextDelimiter = ">";
}

export class Tage extends InlineRenderInlineChildren {
  static componentType = "tage";
  static rendererType = "tag";
  static beginTextDelimiter = "<";
  static endTextDelimiter = "/>";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();
    stateVariableDefinitions.selfClosed = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { selfClosed: true } }),
    };
    return stateVariableDefinitions;
  }
}

export class Tagc extends InlineRenderInlineChildren {
  static componentType = "tagc";
  static rendererType = "tag";
  static beginTextDelimiter = "</";
  static endTextDelimiter = ">";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();
    stateVariableDefinitions.closing = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ setValue: { closing: true } }),
    };
    return stateVariableDefinitions;
  }
}

export class Attr extends InlineRenderInlineChildren {
  static componentType = "attr";
  static rendererType = "c";
}
