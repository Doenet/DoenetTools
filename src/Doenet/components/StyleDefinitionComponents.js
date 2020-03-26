import NumberComponent from './Number';
import TextComponent from './Text';


export class StyleNumber extends NumberComponent {
  static componentType = "stylenumber";
  static rendererType = "number";
}

export class LineColor extends TextComponent {
  static componentType = "lineColor";
  static rendererType = "text";
}

export class LineWidth extends NumberComponent {
  static componentType = "lineWidth";
  static rendererType = "number";
}

export class LineStyle extends TextComponent {
  static componentType = "lineStyle";
  static rendererType = "text";
}

export class MarkerColor extends TextComponent {
  static componentType = "markerColor";
  static rendererType = "text";
}

export class MarkerSize extends NumberComponent {
  static componentType = "markerSize";
  static rendererType = "number";
}

export class MarkerStyle extends TextComponent {
  static componentType = "markerStyle";
  static rendererType = "text";
}