import BooleanComponent from '../Boolean';
import NumberComponent from '../Number';
import TextComponent from '../Text';
import MathComponent from '../Math';
import Point from '../Point';
import MathWithVariable from '../abstract/MathWithVariable';

export class InitialCondition extends MathWithVariable {
  static componentType = "initialcondition";
  static rendererType = "math";''
}

export class HideInitialCondition extends BooleanComponent {
  static componentType = "hideinitialcondition";
  static rendererType = "boolean";
}

export class InitialPoint extends Point {
  static componentType = "initialpoint";
  static rendererType = "point";
}
