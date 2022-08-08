import TextComponent from './Text.js';
import TextOrInline from './abstract/TextOrInline.js';
import Template from './Template.js';
import MathComponent from './Math.js';



export class Columns extends TextComponent {
  static componentType = "columns";
  static rendererType = "text";
}

export class Title extends TextOrInline {
  static componentType = "title";
}

export class RightHandSide extends MathComponent {
  static componentType = "rightHandSide";
  static rendererType = "math";
}

export class Description extends TextOrInline {
  static componentType = "description";
  static rendererType = undefined;
}

export class Else extends Template {
  static componentType = "else";
}

export class externalContent extends Template {
  static componentType = "externalContent";
}
