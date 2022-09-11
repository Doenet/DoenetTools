import TextComponent from './Text.js';
import TextOrInline from './abstract/TextOrInline.js';
import Template from './Template.js';
import MathComponent from './Math.js';
import Label from './Label.js';



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

export class Xlabel extends Label {
  static componentType = "xlabel";
  static rendererType = "label";
}

export class Ylabel extends Label {
  static componentType = "ylabel";
  static rendererType = "label";
}
