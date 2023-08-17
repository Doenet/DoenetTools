import TextComponent from "./Text";
import TextOrInline from "./abstract/TextOrInline";
import Template from "./Template";
import MathComponent from "./Math";
import Label from "./Label";
import MathList from "./MathList";
import { Div } from "./Divisions";

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

export class Xlabel extends Label {
  static componentType = "xlabel";
  static rendererType = "label";
}

export class Ylabel extends Label {
  static componentType = "ylabel";
  static rendererType = "label";
}

export class Zlabel extends Label {
  static componentType = "zlabel";
  static rendererType = "label";
}

export class MatrixRow extends MathList {
  static componentType = "matrixRow";
  static rendererType = "mathList";
  static excludeFromSchema = true;
}

export class MatrixColumn extends MathList {
  static componentType = "matrixColumn";
  static rendererType = "mathList";
  static excludeFromSchema = true;
}

export class Statement extends Div {
  static componentType = "statement";
}

export class Introduction extends Div {
  static componentType = "introduction";
}

export class Conclusion extends Div {
  static componentType = "conclusion";
}

export class Topic extends TextComponent {
  static componentType = "topic";
  static rendererType = "text";
}
