import NumberComponent from './Number';
import TextComponent from './Text';


export class StyleNumber extends NumberComponent {
  static componentType = "stylenumber";
}

export class LineColor extends TextComponent {
  static componentType = "lineColor";
}

export class LineWidth extends NumberComponent {
  static componentType = "lineWidth";
}

export class LineStyle extends TextComponent {
  static componentType = "lineStyle";
}

export class MarkerColor extends TextComponent {
  static componentType = "markerColor";
}

export class MarkerSize extends NumberComponent {
  static componentType = "markerSize";
}

export class MarkerStyle extends TextComponent {
  static componentType = "markerStyle";
}