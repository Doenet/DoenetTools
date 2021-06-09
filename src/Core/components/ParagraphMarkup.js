import InlineRenderInlineChildren from './abstract/InlineRenderInlineChildren';

export class Em extends InlineRenderInlineChildren {
  static componentType = "em";
}

export class Alert extends InlineRenderInlineChildren {
  static componentType = "alert";
}

export class Q extends InlineRenderInlineChildren {
  static componentType = "q";
}

export class SQ extends InlineRenderInlineChildren {
  static componentType = "sq";
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
}

export class Tage extends InlineRenderInlineChildren {
  static componentType = "tage";
  static rendererType = "tag";

  static returnStateVariableDefinitions() {
    let stateVariableDefinitions = super.returnStateVariableDefinitions();
    stateVariableDefinitions.selfClosed = {
      forRenderer: true,
      returnDependencies: () => ({}),
      definition: () => ({ newValues: { selfClosed: true } })
    }
    return stateVariableDefinitions;
  }
}

export class Attr extends InlineRenderInlineChildren {
  static componentType = "attr";
  static rendererType = "c";
}
