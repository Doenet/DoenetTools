import BooleanComponent from './Boolean';
import TextComponent from './Text';
import TextFromSingleStringChild from './abstract/TextFromSingleStringChild';
import MathWithVariable from './abstract/MathWithVariable';
import MathList from './MathList';
import TextOrInline from './abstract/TextOrInline';
import Option from './Option';
import Template from './Template';



export class Columns extends TextComponent {
  static componentType = "columns";
  static rendererType = "text";
}

export class Title extends TextOrInline {
  static componentType = "title";
  static rendererType = "textOrInline";
}

export class Variant extends TextFromSingleStringChild {
  static componentType = "variant";
  static rendererType = "text";
}

export class Seed extends TextFromSingleStringChild {
  static componentType = "seed";
  static rendererType = "text";
}

export class RightHandSide extends MathWithVariable {
  static componentType = "righthandside";
  static rendererType = "math";
}

export class Input extends MathList {
  static componentType = "input";
  static rendererType = "asList";
}

export class Description extends TextOrInline {
  static componentType = "description";
  static rendererType = "textorinline";
}


export class Keyword extends TextComponent {
  static componentType = "keyword";
  static rendererType = "text";
}


export class Target extends TextComponent {
  static componentType = "target";
  static rendererType = "text";
}

export class SortResults extends BooleanComponent {
  static componentType = "sortresults";
  static rendererType = "boolean";
}

export class Condition extends BooleanComponent {
  static componentType = "condition";
  static rendererType = "boolean";
}

export class Else extends Option {
  static componentType = "else";
}

export class externalContent extends Template {
  static componentType = "externalContent";
}
