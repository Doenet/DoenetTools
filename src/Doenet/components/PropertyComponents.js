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
import MathList from './MathList';
import When from './When';
import TextOrInline from './abstract/TextOrInline';
import Option from './Option';
import Variants from './Variants';

export class Hide extends BooleanComponent {
  static componentType = "hide";
  static rendererType = "boolean";
}

export class Disabled extends BooleanComponent {
  static componentType = "disabled";
  static rendererType = "boolean";
}

export class Draggable extends BooleanComponent {
  static componentType = "draggable";
  static rendererType = "boolean";
}

export class ModifyIndirectly extends BooleanComponent {
  static componentType = "modifyIndirectly";
  static rendererType = "boolean";
}

export class Fixed extends BooleanComponent {
  static componentType = "fixed";
  static rendererType = "boolean";
}

export class Label extends TextComponent {
  static componentType = "label";
  static rendererType = "text";
}

export class ChildNumber extends Integer {
  static componentType = "childnumber";
  static rendererType = "number";
}

export class includeUndefinedObjects extends BooleanComponent {
  static componentType = "includeUndefinedObjects";
  static rendererType = "boolean";
}

export class Prefill extends TextComponent {
  static componentType = "prefill";
  static rendererType = "text";
}

export class Format extends TextComponent {
  static componentType = "format";
  static rendererType = "text";
}

export class Credit extends NumberComponent {
  static componentType = "credit";
  static rendererType = "number";
}

export class Weight extends NumberComponent {
  static componentType = "weight";
  static rendererType = "number";
}

export class PossiblePoints extends NumberComponent {
  static componentType = "possiblepoints";
  static rendererType = "number";
}

export class Through extends PointListComponent {
  static componentType = "through"
  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.slope = { default: null };
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
  static rendererType = "point";
}

export class Tail extends Point {
  static componentType = "tail"
  static rendererType = "point";
}

export class Displacement extends Vector {
  static componentType = "displacement"
  static rendererType = "vector";
}

export class Center extends Point {
  static componentType = "center"
  static rendererType = "point";
}

export class Radius extends MathComponent {
  static componentType = "radius";
  static rendererType = "math";
}

export class Xmin extends NumberComponent {
  static componentType = "xmin";
  static rendererType = "number";
}

export class Xmax extends NumberComponent {
  static componentType = "xmax";
  static rendererType = "number";
}

export class Ymin extends NumberComponent {
  static componentType = "ymin";
  static rendererType = "number";
}

export class Ymax extends NumberComponent {
  static componentType = "ymax";
  static rendererType = "number";
}

export class Dx extends NumberComponent {
  static componentType = "dx";
  static rendererType = "number";
}

export class Dy extends NumberComponent {
  static componentType = "dy";
  static rendererType = "number";
}

export class Dz extends NumberComponent {
  static componentType = "dz";
  static rendererType = "number";
}

export class Xoffset extends NumberComponent {
  static componentType = "xoffset";
  static rendererType = "number";
}

export class Yoffset extends NumberComponent {
  static componentType = "yoffset";
  static rendererType = "number";
}

export class Zoffset extends NumberComponent {
  static componentType = "zoffset";
  static rendererType = "number";
}

export class Xthreshold extends NumberComponent {
  static componentType = "xthreshold";
  static rendererType = "number";
}

export class Ythreshold extends NumberComponent {
  static componentType = "ythreshold";
  static rendererType = "number";
}

export class Zthreshold extends NumberComponent {
  static componentType = "zthreshold";
  static rendererType = "number";
}

export class Threshold extends NumberComponent {
  static componentType = "threshold";
  static rendererType = "number";
}

export class IncludeGridlines extends BooleanComponent {
  static componentType = "includegridlines";
  static rendererType = "boolean";
}

export class ShowControls extends BooleanComponent {
  static componentType = "showcontrols";
  static rendererType = "boolean";
}

export class ShowTicks extends BooleanComponent {
  static componentType = "showticks";
  static rendererType = "boolean";
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
  static rendererType = "math";
}

export class MinNumRows extends Integer {
  static componentType = "minnumrows";
  static rendererType = "number";
}

export class MinNumColumns extends Integer {
  static componentType = "minnumcolumns";
  static rendererType = "number";
}

export class RowNum extends TextComponent {
  static componentType = "rownum";
  static rendererType = "text";
}

export class ColNum extends TextComponent {
  static componentType = "colnum";
  static rendererType = "text";
}

export class DefaultType extends TextComponent {
  static componentType = "defaulttype";
  static rendererType = "text";
}

export class Behavior extends TextComponent {
  static componentType = "behavior";
  static rendererType = "text";
}

export class Width extends ComponentSize {
  static componentType = "width";
}

export class Height extends ComponentSize {
  static componentType = "height";
}

export class Columns extends TextComponent {
  static componentType = "columns";
  static rendererType = "text";
}

export class Depth extends NumberComponent {
  static componentType = "depth";
  static rendererType = "number";
}

export class InitialNumber extends NumberComponent {
  static rendererType = "number";
  static componentType = "initialnumber";
}

export class InitialText extends TextComponent {
  static componentType = "initialtext";
  static rendererType = "text";
}

export class Parameter extends Variable {
  static componentType = "parameter";
  static rendererType = "math";
}

export class ParMin extends MathComponent {
  static componentType = "parmin";
  static rendererType = "math";
}

export class ParMax extends MathComponent {
  static componentType = "parmax";
  static rendererType = "math";
}

export class Formula extends MathComponent {
  static componentType = "formula";
  static rendererType = "math";
}

export class FlipFunction extends BooleanComponent {
  static componentType = "flipfunction";
  static rendererType = "boolean";
}

export class SplineTension extends NumberComponent {
  static componentType = "splinetension";
  static rendererType = "number";
}

export class SplineForm extends TextComponent {
  static componentType = "splineform";
  static rendererType = "text";
}

export class Angles extends AngleListComponent {
  static componentType = "angles";
}

export class PointNumber extends NumberComponent {
  static componentType = "pointnumber";
  static rendererType = "number";
}

export class Direction extends TextComponent {
  static componentType = "direction";
  static rendererType = "text";
}

export class Location extends MathComponent {
  static componentType = "location";
  static rendererType = "math";
}

export class Value extends MathComponent {
  static componentType = "value";
  static rendererType = "math";
}

export class Xscale extends NumberComponent {
  static componentType = "xscale";
  static rendererType = "number";
}

export class Yscale extends NumberComponent {
  static componentType = "yscale";
  static rendererType = "number";
}

export class ExtrapolateBackward extends BooleanComponent {
  static componentType = "extrapolatebackward";
  static rendererType = "boolean";
}

export class ExtrapolateForward extends BooleanComponent {
  static componentType = "extrapolateforward";
  static rendererType = "boolean";
}

export class Simplify extends TextComponent {
  static componentType = "simplify";
  static rendererType = "text";
}

export class SimplifyOnCompare extends TextComponent {
  static componentType = "simplifyOnCompare";
  static rendererType = "text";
}

export class VariableName extends TextComponent {
  static componentType = "variablename";
  static rendererType = "text";
}

export class AuthorProp extends TextComponent {
  static componentType = "authorprop";
  static rendererType = "text";
}

export class Index extends NumberComponent {
  static componentType = "index";
  static rendererType = "number";
}

export class AggregateScores extends BooleanComponent {
  static componentType = "aggregatescores";
  static rendererType = "boolean";
}

// export class AggregateByPoints extends BooleanComponent {
//   static componentType = "aggregatebypoints";
// }

export class Title extends TextOrInline {
  static componentType = "title";
  static rendererType = "textorinline";
}

export class Level extends NumberComponent {
  static componentType = "level";
  static rendererType = "number";
}

export class Variant extends TextFromSingleStringChild {
  static componentType = "variant";
  static rendererType = "text";
}

export class SelectForVariants extends Variants {
  static componentType = "selectForVariants";
}

export class NVariants extends Integer {
  static componentType = "nvariants";
  static rendererType = "number";
}

export class UniqueVariants extends BooleanComponent {
  static componentType = "uniquevariants";
  static rendererType = "boolean";
}

export class Seed extends TextFromSingleStringChild {
  static componentType = "seed";
  static rendererType = "text";
}

export class NumberToSelect extends Integer {
  static componentType = "numbertoselect";
  static rendererType = "number";
}

export class WithReplacement extends BooleanComponent {
  static componentType = "withreplacement";
  static rendererType = "boolean";
}

export class DisplayDigits extends Integer {
  static componentType = "displaydigits";
  static rendererType = "number";
}

export class SelectWeight extends NumberComponent {
  static componentType = "selectweight";
  static rendererType = "number";
}

export class IndependentVariable extends Variable {
  static componentType = "independentvariable";
  static rendererType = "math";
}

export class InitialIndependentVariableValue extends MathComponent {
  static componentType = "initialindependentvariablevalue";
  static rendererType = "math";
}

export class RightHandSide extends MathWithVariable {
  static componentType = "righthandside";
  static rendererType = "math";
}

export class RenderMode extends TextComponent {
  static componentType = "rendermode";
  static rendererType = "text";
}

export class RenderAsMath extends BooleanComponent {
  static componentType = "renderasmath";
  static rendererType = "boolean";
}

export class ChunkSize extends NumberComponent {
  static componentType = "chunksize";
  static rendererType = "number";
}

export class AnimationOn extends BooleanComponent {
  static componentType = "animationon";
  static rendererType = "boolean";
}

export class AnimationMode extends TextComponent {
  static componentType = "animationmode";
  static rendererType = "text";
}

export class AnimationInterval extends NumberComponent {
  static componentType = "animationinterval";
  static rendererType = "number";
}

export class InitialSelectedIndex extends Integer {
  static componentType = "initialselectedindex";
  static rendererType = "number";
}

export class Numeric extends BooleanComponent {
  static componentType = "numeric";
  static rendererType = "boolean";
}

export class Symbolic extends BooleanComponent {
  static componentType = "symbolic";
  static rendererType = "boolean";
}

export class Input extends MathList {
  static componentType = "input";
  static rendererType = "aslist";
}

export class X extends MathComponent {
  static componentType = "x";
  static rendererType = "math";
}

export class Y extends MathComponent {
  static componentType = "y";
  static rendererType = "math";
}

export class Z extends MathComponent {
  static componentType = "z";
  static rendererType = "math";
}

export class Xs extends MathList {
  static componentType = "xs";
  static rendererType = "aslist";
}

export class Layer extends Integer {
  static componentType = "layer";
  static rendererType = "number";
}

export class RenderAsAcuteAngle extends BooleanComponent {
  static componentType = "renderasacuteangle";
  static rendererType = "boolean";
}

export class DisplayXAxis extends BooleanComponent {
  static componentType = "displayxaxis";
  static rendererType = "boolean";
}

export class DisplayYAxis extends BooleanComponent {
  static componentType = "displayyaxis";
  static rendererType = "boolean";
}

export class Xlabel extends TextComponent {
  static componentType = "xlabel";
  static rendererType = "text";
}

export class Ylabel extends TextComponent {
  static componentType = "ylabel";
  static rendererType = "text";
}

export class Zlabel extends TextComponent {
  static rendererType = "text";
  static componentType = "zlabel";
}

export class UpperValue extends NumberComponent {
  static componentType = "uppervalue";
  static rendererType = "number";
}

export class LowerValue extends NumberComponent {
  static componentType = "lowervalue";
  static rendererType = "number";
}

export class Tolerance extends NumberComponent {
  static componentType = "tolerance";
  static rendererType = "number";
}

export class MaxIterations extends Integer {
  static componentType = "maxiterations";
  static rendererType = "number";
}

export class Unbiased extends BooleanComponent {
  static componentType = "unbiased";
  static rendererType = "boolean";
}

export class NumberOfSamples extends Integer {
  static componentType = "numberofsamples";
  static rendererType = "number";
}

export class MatchWholeWord extends BooleanComponent {
  static componentType = "matchwholeword";
  static rendererType = "boolean";
}

export class CaseSensitive extends BooleanComponent {
  static componentType = "casesensitive";
  static rendererType = "boolean";
}

export class Offset extends MathComponent {
  static componentType = "offset";
  static rendererType = "math";
}

export class Period extends MathComponent {
  static componentType = "period";
  static rendererType = "math";
}

export class MinIndex extends MathComponent {
  static componentType = "minindex";
  static rendererType = "math";
}

export class MaxIndex extends MathComponent {
  static componentType = "maxindex";
  static rendererType = "math";
}

export class NumberDecimals extends Integer {
  static componentType = "numberdecimals";
  static rendererType = "number";
}

export class NumberDigits extends Integer {
  static componentType = "numberdigits";
  static rendererType = "number";
}

export class ComponentTypes extends TextList {
  static componentType = "componenttypes";
  static rendererType = "textlist";
}

export class Source extends TextComponent {
  static componentType = "source";
  static rendererType = "text";
}

export class Description extends TextOrInline {
  static componentType = "description";
  static rendererType = "textorinline";
}

export class SelectMultiple extends BooleanComponent {
  static componentType = "selectmultiple";
  static rendererType = "boolean";
}

export class AssignPartialCredit extends BooleanComponent {
  static componentType = "assignpartialcredit";
  static rendererType = "boolean";
}

export class Inline extends BooleanComponent {
  static componentType = "inline";
  static rendererType = "boolean";
}

export class FixedOrder extends BooleanComponent {
  static componentType = "fixedorder";
  static rendererType = "boolean";
}

export class Uri extends TextComponent {
  static componentType = "uri";
  static rendererType = "text";
}

export class Youtube extends TextComponent {
  static componentType = "youtube";
  static rendererType = "text";
}

export class Geogebra extends TextComponent {
  static componentType = "geogebra";
  static rendererType = "text";
}

export class Keyword extends TextComponent {
  static componentType = "keyword";
  static rendererType = "text";
}

export class Size extends NumberComponent {
  static componentType = "size";
  static rendererType = "number";
}

export class Expand extends BooleanComponent {
  static componentType = "expand";
  static rendererType = "boolean";
}

export class ExpandOnCompare extends BooleanComponent {
  static componentType = "expandOnCompare";
  static rendererType = "boolean";
}

export class Unordered extends BooleanComponent {
  static componentType = "unordered";
  static rendererType = "boolean";
}

export class UnorderedCompare extends BooleanComponent {
  static componentType = "unorderedCompare";
  static rendererType = "boolean";
}

export class MatchPartial extends BooleanComponent {
  static componentType = "matchpartial";
  static rendererType = "boolean";
}

export class SymbolicEquality extends BooleanComponent {
  static componentType = "symbolicequality";
  static rendererType = "boolean";
}

export class ShowCorrectness extends BooleanComponent {
  static componentType = "showCorrectness";
  static rendererType = "boolean";
}

export class createIntervals extends BooleanComponent {
  static componentType = "createintervals";
  static rendererType = "boolean";
}

export class createVectors extends BooleanComponent {
  static componentType = "createvectors";
  static rendererType = "boolean";
}

export class AllowedErrorInNumbers extends NumberComponent {
  static componentType = "allowederrorinnumbers";
  static rendererType = "number";
}

export class IncludeErrorInNumberExponents extends BooleanComponent {
  static componentType = "includeerrorinnumberexponents";
  static rendererType = "boolean";
}

export class AllowedErrorIsAbsolute extends BooleanComponent {
  static componentType = "allowederrorisabsolute";
  static rendererType = "boolean";
}

export class NSignErrorsMatched extends Integer {
  static componentType = "nsignerrorsmatched";
  static rendererType = "number";
}

export class FeedbackCode extends TextComponent {
  static componentType = "feedbackcode";
  static rendererType = "text";
}

export class FeedbackText extends TextComponent {
  static componentType = "feedbacktext";
  static rendererType = "text";
}

export class FeedbackCodes extends TextList {
  static componentType = "feedbackcodes";
  static rendererType = "textlist";
}

export class TextType extends TextComponent {
  static componentType = "texttype";
  static rendererType = "text";
}

export class BranchId extends TextComponent {
  static componentType = "branchid";
  static rendererType = "text";
}

export class ContentId extends TextComponent {
  static componentType = "contentid";
  static rendererType = "text";
}

export class Target extends TextComponent {
  static componentType = "target";
  static rendererType = "text";
}

export class targetPropertiesToIgnore extends TextList {
  static componentType = "targetPropertiesToIgnore";
  static rendererType = "textlist";
}

export class PluralForm extends TextComponent {
  static componentType = "pluralform";
  static rendererType = "text";
}

export class BasedOnNumber extends NumberComponent {
  static componentType = "basedonnumber";
  static rendererType = "number";
}

export class DisplaySmallAsZero extends BooleanComponent {
  static componentType = "displaysmallaszero";
  static rendererType = "boolean";
}

export class MaximumNumber extends NumberComponent {
  static componentType = "maximumnumber";
  static rendererType = "number";
}

export class MaximumNumberToSelect extends NumberComponent {
  static componentType = "maximumNumberToSelect";
  static rendererType = "number";
}

export class ShowLabel extends BooleanComponent {
  static componentType = "showlabel";
  static rendererType = "boolean";
}

export class MergeMathLists extends BooleanComponent {
  static componentType = "mergemathlists";
  static rendererType = "boolean";
}

export class AttractThreshold extends NumberComponent {
  static componentType = "attractthreshold";
  static rendererType = "number";
}

export class NPoints extends NumberComponent {
  static componentType = "npoints";
  static rendererType = "number";
}

export class SortResults extends BooleanComponent {
  static componentType = "sortresults";
  static rendererType = "boolean";
}

export class Slope extends MathComponent {
  static componentType = "slope";
  static rendererType = "math";
}

export class ForceFullCheckWorkButton extends BooleanComponent {
  static componentType = "forcefullcheckworkbutton";
  static rendererType = "boolean";
}

export class PossibleNumberOfGroups extends NumberList {
  static componentType = "PossibleNumberOfGroups";
  static rendererType = "numberlist";
}

export class NDiscretizationPoints extends NumberComponent {
  static componentType = "ndiscretizationpoints";
  static rendererType = "number";
}

export class Periodic extends BooleanComponent {
  static componentType = "periodic";
  static rendererType = "boolean";
}

export class IsResponse extends BooleanComponent {
  static componentType = "isResponse";
  static rendererType = "boolean";
}

export class SectionWideCheckWork extends BooleanComponent {
  static componentType = "sectionWideCheckWork";
  static rendererType = "boolean";
}

export class delegateCheckWorkToAnswerNumber extends NumberComponent {
  static componentType = "delegateCheckWorkToAnswerNumber";
  static rendererType = "number";
}

export class Condition extends BooleanComponent {
  static componentType = "condition";
  static rendererType = "boolean";
}

export class EncodedGeogebraContent extends TextComponent {
  static componentType = "encodedGeogebraContent";
  static rendererType = "text";
}

export class FromMathInsight extends TextComponent {
  static componentType = "fromMathInsight";
  static rendererType = "text";
}

export class HeadDraggable extends BooleanComponent {
  static componentType = "headDraggable";
  static rendererType = "boolean";
}

export class TailDraggable extends BooleanComponent {
  static componentType = "tailDraggable";
  static rendererType = "boolean";
}

export class ShowNavigation extends BooleanComponent {
  static componentType = "showNavigation";
  static rendererType = "boolean";
}

export class SelectIndices extends NumberList {
  static componentType = "selectIndices";
  static rendererType = "numberlist";
}

export class Rendered extends BooleanComponent {
  static componentType = "rendered";
  static rendererType = "boolean";
}

export class Else extends Option {
  static componentType = "else";
}

export class Result extends Option {
  static componentType = "result";
}

export class ComponentIndex extends NumberComponent {
  static componentType = "componentIndex";
  static rendererType = "number";
}

export class PropIndex extends NumberList {
  static componentType = "propIndex";
  static rendererType = "number";
}