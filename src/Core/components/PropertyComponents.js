import TextComponent from './Text';
import TextFromSingleStringChild from './abstract/TextFromSingleStringChild';
import MathWithVariable from './abstract/MathWithVariable';
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

export class Description extends TextOrInline {
  static componentType = "description";
  static rendererType = "textOrInline";
}

export class Else extends Option {
  static componentType = "else";
}

export class externalContent extends Template {
  static componentType = "externalContent";
}
