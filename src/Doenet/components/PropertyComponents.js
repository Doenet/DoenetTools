import BooleanComponent from './Boolean';
import NumberComponent from './Number';
import Integer from './Integer';
import TextComponent from './Text';
import MathComponent from './Math';
import TextFromSingleStringChild from './abstract/TextFromSingleStringChild';
import ComponentWithSelectableType from './abstract/ComponentWithSelectableType';
import ComponentListWithSelectableType from './abstract/ComponentListWithSelectableType';
import ComponentWithAnyChildren from './abstract/ComponentWithAnyChildren';
import PointListComponent from './abstract/PointListComponent';
import VectorListComponent from './abstract/VectorListComponent';
import AngleListComponent from './abstract/AngleListComponent';
import Point from './Point';
import Vector from './Vector';
import ComponentSize from './abstract/ComponentSize';
import Variable from './Variable';
import MathWithVariable from './abstract/MathWithVariable';
import TextList from './TextList';
import NumberList from './NumberList';

export class Hide extends BooleanComponent {
  static componentType = "hide";
}

export class Draggable extends BooleanComponent {
  static componentType = "draggable";
}

export class modifyIndirectly extends BooleanComponent {
  static componentType = "modifyIndirectly";
}

export class Fixed extends BooleanComponent {
  static componentType = "fixed";
}

export class Label extends TextComponent {
  static componentType = "label";
}

export class ChildNumber extends Integer {
  static componentType = "childnumber";
}

export class Prefill extends TextComponent {
  static componentType = "prefill";
}

export class Format extends TextComponent {
  static componentType = "format";
}

export class Credit extends NumberComponent {
  static componentType = "credit";
}

export class Weight extends NumberComponent {
  static componentType = "weight";
}

export class PossiblePoints extends NumberComponent {
  static componentType = "possiblepoints";
}

export class Through extends PointListComponent {
  static componentType = "through"
  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.slope = {default: undefined};
    return properties;
  }
}

export class Endpoints extends PointListComponent {
  static componentType = "endpoints"
}

export class Vertices extends PointListComponent {
  static componentType = "vertices"
}

export class Head extends Point {
  static componentType = "head"
  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.hide = {default: true};
    return properties;
  }
}

export class Tail extends Point {
  static componentType = "tail"
  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.hide = {default: true};
    return properties;
  }
}

export class Displacement extends Vector {
  static componentType = "displacement"
}

export class Center extends Point {
  static componentType = "center"
  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.hide = {default: true};
    return properties;
  }
}

export class Radius extends MathComponent {
  static componentType = "radius";
}

export class Xmin extends NumberComponent {
  static componentType = "xmin";
}

export class Xmax extends NumberComponent {
  static componentType = "xmax";
}

export class Ymin extends NumberComponent {
  static componentType = "ymin";
}

export class Ymax extends NumberComponent {
  static componentType = "ymax";
}

export class Dx extends NumberComponent {
  static componentType = "dx";
}

export class Dy extends NumberComponent {
  static componentType = "dy";
}

export class Dz extends NumberComponent {
  static componentType = "dz";
}

export class Xoffset extends NumberComponent {
  static componentType = "xoffset";
}

export class Yoffset extends NumberComponent {
  static componentType = "yoffset";
}

export class Zoffset extends NumberComponent {
  static componentType = "zoffset";
}

export class Xthreshold extends NumberComponent {
  static componentType = "xthreshold";
}

export class Ythreshold extends NumberComponent {
  static componentType = "ythreshold";
}

export class Zthreshold extends NumberComponent {
  static componentType = "zthreshold";
}

export class Threshold extends NumberComponent {
  static componentType = "threshold";
}

export class IncludeGridlines extends BooleanComponent {
  static componentType = "includegridlines";
}

export class ShowControls extends BooleanComponent {
  static componentType = "showcontrols";
}

export class ShowTicks extends BooleanComponent {
  static componentType = "showticks";
}

export class From extends ComponentWithSelectableType {
  static componentType = "from";
}

export class To extends ComponentWithSelectableType {
  static componentType = "to";
}

export class Exclude extends ComponentListWithSelectableType {
  static componentType = "exclude";
}

export class ExcludeCombination extends ComponentListWithSelectableType {
  static componentType = "excludecombination";
}

export class Step extends MathComponent {
  static componentType = "step";
}

export class NumRows extends Integer {
  static componentType = "numrows";
}

export class NumColumns extends Integer {
  static componentType = "numcolumns";
}

export class RowNum extends TextComponent {
  static componentType = "rownum";
}

export class ColNum extends TextComponent {
  static componentType = "colnum";
}

export class Type extends TextComponent {
  static componentType = "type";
}

export class DefaultType extends TextComponent {
  static componentType = "defaulttype";
}

export class Behavior extends TextComponent {
  static componentType = "behavior";
}

export class Width extends ComponentSize {
  static componentType = "width";
}

export class Height extends ComponentSize {
  static componentType = "height";
}

export class Columns extends TextComponent {
  static componentType = "columns";
}

export class Depth extends NumberComponent {
  static componentType = "depth";
}

export class InitialNumber extends NumberComponent {
  static componentType = "initialnumber";
}

export class InitialText extends TextComponent {
  static componentType = "initialtext";
}

export class Parameter extends Variable {
  static componentType = "parameter";
}

export class ParMin extends MathComponent {
  static componentType = "parmin";
}

export class ParMax extends MathComponent {
  static componentType = "parmax";
}

export class Formula extends MathComponent {
  static componentType = "formula";
}

export class FlipFunction extends BooleanComponent {
  static componentType = "flipfunction";
}

export class SplineTension extends NumberComponent {
  static componentType = "splinetension";
}

export class SplineForm extends TextComponent {
  static componentType = "splineform";
}

export class ControlPoints extends PointListComponent {
  static componentType = "controlpoints";
}

export class ControlVectors extends VectorListComponent {
  static componentType = "controlvectors";
}

export class DefaultControls extends TextComponent {
  static componentType = "defaultcontrols";
}

export class Angles extends AngleListComponent {
  static componentType = "angles";
}

export class Location extends MathComponent {
  static componentType = "location";
}

export class Value extends MathComponent {
  static componentType = "value";
}

export class Xscale extends NumberComponent {
  static componentType = "xscale";
}

export class Yscale extends NumberComponent {
  static componentType = "yscale";
}

export class ExtrapolateBackward extends BooleanComponent {
  static componentType = "extrapolatebackward";
}

export class ExtrapolateForward extends BooleanComponent {
  static componentType = "extrapolateforward";
}

export class Simplify extends TextComponent {
  static componentType = "simplify";
}

export class SimplifyOnCompare extends TextComponent {
  static componentType = "simplifyOnCompare";
}

export class VariableName extends TextComponent {
  static componentType = "variablename";
}

export class AuthorProp extends TextComponent {
  static componentType = "authorprop";
}

export class Index extends NumberComponent {
  static componentType = "index";
}

export class AggregateScores extends BooleanComponent {
  static componentType = "aggregatescores";
}

// export class AggregateByPoints extends BooleanComponent {
//   static componentType = "aggregatebypoints";
// }

export class Title extends TextComponent {
  static componentType = "title";
}

export class Level extends NumberComponent {
  static componentType = "level";
}

export class Variant extends TextFromSingleStringChild {
  static componentType = "variant";
}

export class NVariants extends Integer {
  static componentType = "nvariants";
}

export class UniqueVariants extends BooleanComponent {
  static componentType = "uniquevariants";
}

export class Seed extends TextFromSingleStringChild {
  static componentType = "seed";
}

export class NumberToSelect extends Integer {
  static componentType = "numbertoselect";
}

export class WithReplacement extends BooleanComponent {
  static componentType = "withreplacement";
}

export class DisplayDigits extends Integer {
  static componentType = "displaydigits";
}

export class SelectWeight extends NumberComponent {
  static componentType = "selectweight";
}

export class IndependentVariable extends Variable {
  static componentType = "independentvariable";
}

export class InitialIndependentVariableValue extends MathComponent {
  static componentType = "initialindependentvariablevalue";
}

export class RightHandSide extends MathWithVariable {
  static componentType = "righthandside";
}

export class RenderMode extends TextComponent {
  static componentType = "rendermode";
}

export class ChunkSize extends NumberComponent {
  static componentType = "chunksize";
}

export class AnimationOn extends BooleanComponent {
  static componentType = "animationon";
}

export class AnimationMode extends TextComponent {
  static componentType = "animationmode";
}

export class AnimationInterval extends NumberComponent {
  static componentType = "animationinterval";
}

export class InitialSelectedIndex extends Integer {
  static componentType = "initialselectedindex";
}

export class Numeric extends BooleanComponent {
  static componentType = "numeric";
}

export class X extends MathComponent {
  static componentType = "x";
}

export class Y extends MathComponent {
  static componentType = "y";
}

export class Z extends MathComponent {
  static componentType = "z";
}

export class Layer extends Integer {
  static componentType = "layer";
}

export class RenderAsAcuteAngle extends BooleanComponent {
  static componentType = "renderasacuteangle";
}

export class DisplayAxes extends BooleanComponent {
  static componentType = "displayaxes";
}

export class Xlabel extends TextComponent {
  static componentType = "xlabel";
}

export class Ylabel extends TextComponent {
  static componentType = "ylabel";
}

export class Zlabel extends TextComponent {
  static componentType = "zlabel";
}

export class UpperValue extends NumberComponent {
  static componentType = "uppervalue";
}

export class LowerValue extends NumberComponent {
  static componentType = "lowervalue";
}

export class Tolerance extends NumberComponent {
  static componentType = "tolerance";
}

export class MaxIterations extends Integer {
  static componentType = "maxiterations";
}

export class Unbiased extends BooleanComponent {
  static componentType = "unbiased";
}

export class NumberOfSamples extends Integer {
  static componentType = "numberofsamples";
}

export class MatchWholeWord extends BooleanComponent {
  static componentType = "matchwholeword";
}

export class CaseSensitive extends BooleanComponent {
  static componentType = "casesensitive";
}

export class Offset extends MathComponent {
  static componentType = "offset";
}

export class Period extends MathComponent {
  static componentType = "period";
}

export class MinIndex extends MathComponent {
  static componentType = "minindex";
}

export class MaxIndex extends MathComponent {
  static componentType = "maxindex";
}

export class NumberDecimals extends Integer {
  static componentType = "numberdecimals";
}

export class NumberDigits extends Integer {
  static componentType = "numberdigits";
}

export class ComponentTypes extends TextList {
  static componentType = "componenttypes";
}

export class Source extends TextComponent {
  static componentType = "source";
}

export class Description extends TextComponent {
  static componentType = "description";
}

export class SelectMultiple extends BooleanComponent {
  static componentType = "selectmultiple";
}

export class AssignPartialCredit extends BooleanComponent {
  static componentType = "assignpartialcredit";
}

export class Inline extends BooleanComponent {
  static componentType = "inline";
}

export class FixedOrder extends BooleanComponent {
  static componentType = "fixedorder";
}

export class Href extends TextComponent {
  static componentType = "href";
}

export class Youtube extends TextComponent {
  static componentType = "youtube";
}

export class SplitIntoOptions extends BooleanComponent {
  static componentType = "splitintooptions";
}

export class Keyword extends TextComponent {
  static componentType = "keyword";
}

export class Size extends NumberComponent {
  static componentType = "size";
}

export class Expand extends BooleanComponent {
  static componentType = "expand";
}

export class ExpandOnCompare extends BooleanComponent {
  static componentType = "expandOnCompare";
}

export class Unordered extends BooleanComponent {
  static componentType = "unordered";
}

export class UnorderedCompare extends BooleanComponent {
  static componentType = "unorderedCompare";
}

export class MatchPartial extends BooleanComponent {
  static componentType = "matchpartial";
}

export class SymbolicEquality extends BooleanComponent {
  static componentType = "symbolicequality";
}

export class createIntervals extends BooleanComponent {
  static componentType = "createintervals";
}

export class createVectors extends BooleanComponent {
  static componentType = "createvectors";
}

export class AllowedErrorInNumbers extends NumberComponent {
  static componentType = "allowederrorinnumbers";
}

export class IncludeErrorInNumberExponents extends BooleanComponent {
  static componentType = "includeerrorinnumberexponents";
}

export class AllowedErrorIsAbsolute extends BooleanComponent {
  static componentType = "allowederrorisabsolute";
}

export class NSignErrorsMatched extends Integer {
  static componentType = "nsignerrorsmatched";
}

export class FeedbackCode extends TextComponent {
  static componentType = "feedbackcode";
}

export class FeedbackText extends TextComponent {
  static componentType = "feedbacktext";
}

export class FeedbackCodes extends TextList {
  static componentType = "feedbackcodes";
}

export class TextType extends TextComponent {
  static componentType = "texttype";
}

export class BranchId extends TextComponent {
  static componentType = "branchid";
}

export class ContentId extends TextComponent {
  static componentType = "contentid";
}

export class Target extends TextComponent {
  static componentType = "target";
}

export class PluralForm extends TextComponent {
  static componentType = "pluralform";
}

export class BasedOnNumber extends NumberComponent {
  static componentType = "basedonnumber";
}

export class DisplaySmallAsZero extends BooleanComponent {
  static componentType = "displaysmallaszero";
}

export class StyleNumber extends NumberComponent {
  static componentType = "stylenumber";
}

export class MaximumNumber extends NumberComponent {
  static componentType = "maximumnumber";
}

export class ShowLabel extends BooleanComponent {
  static componentType = "showlabel";
}

export class MergeMathLists extends BooleanComponent {
  static componentType = "mergemathlists";
}

export class MergeNumberLists extends BooleanComponent {
  static componentType = "mergenumberlists";
}

export class AttractThreshold extends NumberComponent {
  static componentType = "attractthreshold";
}

export class NPoints extends NumberComponent {
  static componentType = "npoints";
}

export class SortResults extends BooleanComponent {
  static componentType = "sortresults";
}

export class Slope extends MathComponent {
  static componentType = "slope";
}

export class ForceFullCheckWorkButton extends BooleanComponent {
  static componentType = "forcefullcheckworkbutton";
}

export class PossibleNumberOfGroups extends NumberList {
  static componentType = "PossibleNumberOfGroups";
}
