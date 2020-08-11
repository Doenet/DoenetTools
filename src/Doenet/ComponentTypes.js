import * as PropertyComponents from './components/PropertyComponents';
import * as MMeMen from './components/MMeMen';
import * as MdMdnMrow from './components/MdMdnMrow';
import * as BooleanOperators from './components/BooleanOperators';
import * as BooleanOperatorsOfMath from './components/BooleanOperatorsOfMath';
import * as MathOperators from './components/MathOperators';
import * as FunctionOperators from './components/FunctionOperators';
import * as Extrema from './components/Extrema';
import * as NumberOperators from './components/NumberOperators';
import * as PatternReplace from './components/PatternReplace';
import * as ParagraphMarkup from './components/ParagraphMarkup';
import * as SingleCharacterComponents from './components/SingleCharacterComponents';
import * as Sectioning from './components/Sectioning';
import * as Lists from './components/Lists';
import * as DynamicalSystems from './components/dynamicalSystems';
import * as FeedbackDefinition from './components/FeedbackDefinition';
import * as StyleDefinition from './components/StyleDefinition';
import * as StyleDefinitionComponents from './components/StyleDefinitionComponents';
import Document from './components/Document';
import StringComponent from './components/StringComponent';
import Text from './components/Text';
import Letters from './components/Letters';
import TextList from './components/TextList';
import RandomizedTextList from './components/RandomizedTextList';
import MathList from './components/MathList';
import NumberList from './components/NumberList';
import P from './components/P';
import BooleanComponent from './components/Boolean';
import BooleanList from './components/BooleanList';
import MathComponent from './components/Math';
import Copy from './components/Copy';
import Tname from './components/Tname';
import Prop from './components/Prop';
import Extract from './components/Extract';
import Collect from './components/Collect';
import Ref from './components/Ref';
import Point from './components/Point';
import Coords from './components/Coords';
import Line from './components/Line';
import LineSegment from './components/LineSegment';
import Polyline from './components/Polyline';
import Polygon from './components/Polygon';
import Triangle from './components/Triangle';
import Circle from './components/Circle';
import Parabola from './components/Parabola';
import Curve from './components/Curve';
import FunctionCurve from './components/FunctionCurve';
import ParametrizedCurve from './components/ParametrizedCurve';
import BezierCurve from './components/BezierCurve';
import BezierControls from './components/BezierControls';
import ControlVectors from './components/ControlVectors';
import PointListComponent from './components/abstract/PointListComponent';
import VectorListComponent from './components/abstract/VectorListComponent';
import AngleListComponent from './components/abstract/AngleListComponent';
import Vector from './components/Vector';
import Angle from './components/Angle';
import Equation from './components/Equation';
import Answer from './components/Answer';
import Award from './components/Award';
import When from './components/When';
import Mathinput from './components/Mathinput';
import Textinput from './components/Textinput';
import Booleaninput from './components/Booleaninput';
import Choiceinput from './components/Choiceinput';
import Choice from './components/Choice';
import NumberComponent from './components/Number';
import Integer from './components/Integer';
import Graph from './components/Graph';
import Variables from './components/Variables';
import Variable from './components/Variable';
import Function from './components/Function';
import InterpolatedFunction from './components/InterpolatedFunction';
import Template from './components/Template';
import Sequence from './components/Sequence';
import Map from './components/Map';
import Substitutions from './components/Substitutions';
import CopyFromSubs from './components/CopyFromSubs';
import IndexFromSubs from './components/IndexFromSubs';
import Slider from './components/Slider';
import Markers from './components/Markers';
import Constraints from './components/Constraints';
import ConstrainToGrid from './components/ConstrainToGrid';
import AttractToGrid from './components/AttractToGrid';
import ConstrainTo from './components/ConstrainTo';
import AttractTo from './components/AttractTo';
import ConstraintUnion from './components/ConstraintUnion';
import ConstraintToAttractor from './components/ConstraintToAttractor';
import Intersection from './components/Intersection';
import UpdateValue from './components/UpdateValue';
import MathTarget from './components/MathTarget';
import NewMathValue from './components/NewMathValue';
import Panel from './components/Panel';
import ConstrainToAngles from './components/ConstrainToAngles';
import AttractToAngles from './components/AttractToAngles';
import ConditionalContent from './components/ConditionalContent';
import ConditionalInlineContent from './components/ConditionalInlineContent';
import ConditionalText from './components/ConditionalText';
import ConditionalMath from './components/ConditionalMath';
import AsList from './components/AsList';
import Spreadsheet from './components/Spreadsheet';
import Cell from './components/Cell';
import Row from './components/Row';
import Column from './components/Column';
import Cellblock from './components/Cellblock';
import Table from './components/Table';
import Problem from './components/Problem';
import Variants from './components/Variants';
import Seeds from './components/Seeds';
import VariantControl from './components/VariantControl';
import SelectFromSequence from './components/SelectFromSequence';
import Select from './components/Select';
import Group from './components/Group';
import AnimateFromSequence from './components/AnimateFromSequence';
import Evaluate from './components/Evaluate';
import RandomNumber from './components/RandomNumber';
import GenerateRandomNumbers from './components/GenerateRandomNumbers';
import Substitute from './components/Substitute';
import Offsets from './components/Offsets';
import DiscreteInfiniteSet from './components/DiscreteInfiniteSet';
import Image from './components/Image';
import Video from './components/Video';
import Embed from './components/Embed';
import Meta from './components/Meta';
import Hint from './components/Hint';
import Solution from './components/Solution';
import IntComma from './components/IntComma';
import Pluralize from './components/Pluralize';
import Feedback from './components/Feedback';
import Container from './components/Container';
import CollaborateGroups from './components/CollaborateGroups';
import CollaborateGroupSetup from './components/CollaborateGroupSetup';
import Div from './components/Div';


//Extended
import BaseComponent from './components/abstract/BaseComponent';
import InlineComponent from './components/abstract/InlineComponent';
import BlockComponent from './components/abstract/BlockComponent';
import GraphicalComponent from './components/abstract/GraphicalComponent';
import ConstraintComponent from './components/abstract/ConstraintComponent';
import Input from './components/abstract/Input';
import CompositeComponent from './components/abstract/CompositeComponent';
import ComponentWithAnyChildren from './components/abstract/ComponentWithAnyChildren';
import ComponentWithSelectableType from './components/abstract/ComponentWithSelectableType';
import ComponentListWithSelectableType from './components/abstract/ComponentListWithSelectableType';
import BooleanBaseOperator from './components/abstract/BooleanBaseOperator';
import BooleanBaseOperatorOfMath from './components/abstract/BooleanBaseOperatorOfMath';
import MathBaseOperator from './components/abstract/MathBaseOperator';
import MathBaseOperatorOneInput from './components/abstract/MathBaseOperatorOneInput';
import FunctionBaseOperator from './components/abstract/FunctionBaseOperator';
import ComponentSize from './components/abstract/ComponentSize';
import ComponentWithSerializedChildren from './components/abstract/ComponentWithSerializedChildren';
import SectioningComponent from './components/abstract/SectioningComponent';
import TextFromSingleStringChild from './components/abstract/TextFromSingleStringChild';
import MathWithVariable from './components/abstract/MathWithVariable';
import NumberBaseOperatorOrNumber from './components/abstract/NumberBaseOperatorOrNumber';
import InlineRenderInlineChildren from './components/abstract/InlineRenderInlineChildren';


const componentTypeArray = [
  ...Object.values(PropertyComponents),
  ...Object.values(MMeMen),
  ...Object.values(MdMdnMrow),
  ...Object.values(BooleanOperators),
  ...Object.values(BooleanOperatorsOfMath),
  ...Object.values(MathOperators),
  ...Object.values(FunctionOperators),
  ...Object.values(Extrema),
  ...Object.values(NumberOperators),
  ...Object.values(PatternReplace),
  ...Object.values(ParagraphMarkup),
  ...Object.values(SingleCharacterComponents),
  ...Object.values(Sectioning),
  ...Object.values(Lists),
  ...Object.values(DynamicalSystems),
  ...Object.values(FeedbackDefinition),
  ...Object.values(StyleDefinition),
  ...Object.values(StyleDefinitionComponents),
  Document,
  StringComponent,
  Text, Letters, TextList,
  RandomizedTextList,
  P,
  BooleanComponent, BooleanList,
  MathComponent, MathList,
  NumberList,
  Copy, Tname,
  Prop,
  Extract,
  Collect,
  Ref,
  Point, Coords,
  Line, LineSegment, Polyline,
  Polygon,
  Triangle,
  Circle,
  Parabola,
  Curve, FunctionCurve, ParametrizedCurve, BezierCurve,
  BezierControls, ControlVectors,
  Vector,
  Angle,
  Equation,
  Answer, Award, When,
  Mathinput, Textinput, Booleaninput, Choiceinput,
  Choice,
  NumberComponent, Integer,
  Graph,
  Variables,
  Variable,
  Function,
  InterpolatedFunction,
  Template,
  Sequence,
  Slider,
  Spreadsheet,
  Cell,
  Row,
  Column,
  Cellblock,
  Table,
  Markers,
  Panel,
  Map, Substitutions, CopyFromSubs, IndexFromSubs,
  Constraints,
  ConstrainToGrid,
  AttractToGrid,
  ConstrainTo,
  AttractTo,
  ConstraintUnion,
  ConstraintToAttractor,
  Intersection,
  UpdateValue, MathTarget, NewMathValue,
  ConstrainToAngles, AttractToAngles,
  ConditionalContent,
  ConditionalInlineContent,
  ConditionalText,
  ConditionalMath,
  AsList,
  Problem,
  Seeds, Variants, VariantControl,
  SelectFromSequence, Select,
  Group,
  AnimateFromSequence,
  Evaluate,
  RandomNumber,
  GenerateRandomNumbers,
  Substitute,
  Offsets,
  DiscreteInfiniteSet,
  Image,
  Video,
  Embed,
  Meta,
  Hint, Solution,
  IntComma,
  Pluralize,
  Feedback,
  Container,
  CollaborateGroups,
  CollaborateGroupSetup,
  Div,
];

const componentTypeArrayExtended = [
  ...componentTypeArray,
  BaseComponent,
  InlineComponent,
  BlockComponent,
  GraphicalComponent,
  ConstraintComponent,
  Input,
  CompositeComponent,
  ComponentWithAnyChildren,
  ComponentWithSelectableType,
  ComponentListWithSelectableType,
  PointListComponent,
  VectorListComponent,
  AngleListComponent,
  BooleanBaseOperator,
  BooleanBaseOperatorOfMath,
  MathBaseOperator, MathBaseOperatorOneInput,
  FunctionBaseOperator,
  ComponentSize,
  ComponentWithSerializedChildren,
  SectioningComponent,
  TextFromSingleStringChild,
  MathWithVariable,
  NumberBaseOperatorOrNumber,
  InlineRenderInlineChildren,
];

export function standardComponentClasses() {
  const componentClasses = {};
  for (let ct of componentTypeArray) {
    let newComponentType = ct.componentType;
    if (newComponentType === undefined) {
      throw Error("Cannot create component as componentType is undefined for class " + ct)
    }
    newComponentType = newComponentType.toLowerCase();
    if (newComponentType in componentClasses) {
      throw Error("component type " + newComponentType + " defined in two classes");
    }
    if (!(/[a-z]/.test(newComponentType.substring(0, 1)))) {
      throw Error("Invalid component type " + newComponentType + ". Component types must begin with a letter.");
    }
    componentClasses[newComponentType] = ct;
  }
  return componentClasses;
}

export function allComponentClasses() {
  const componentClasses = {};
  for (let ct of componentTypeArrayExtended) {
    let newComponentType = ct.componentType;
    if (newComponentType === undefined) {
      throw Error("Cannot create component as componentType is undefined for class " + ct)
    }
    newComponentType = newComponentType.toLowerCase();
    if (newComponentType in componentClasses) {
      throw Error("component type " + newComponentType + " defined in two classes");
    }
    componentClasses[newComponentType] = ct;
  }
  return componentClasses;
}

export function componentTypesTakingComponentNames() {
  const componentClasses = {};
  for (let ct of componentTypeArray) {
    if (ct.takesComponentName) {
      let newComponentType = ct.componentType;
      if (newComponentType === undefined) {
        throw Error("Cannot create component as componentType is undefined for class " + ct)
      }
      newComponentType = newComponentType.toLowerCase();
      if (newComponentType in componentClasses) {
        throw Error("component type " + newComponentType + " defined in two classes");
      }
      componentClasses[newComponentType] = ct;
    }
  }
  return componentClasses;
}

export function componentTypesCreatingVariants() {
  const componentClasses = {};
  for (let ct of componentTypeArray) {
    if (ct.createsVariants) {
      let newComponentType = ct.componentType;
      if (newComponentType === undefined) {
        throw Error("Cannot create component as componentType is undefined for class " + ct)
      }
      newComponentType = newComponentType.toLowerCase();
      if (newComponentType in componentClasses) {
        throw Error("component type " + newComponentType + " defined in two classes");
      }
      componentClasses[newComponentType] = ct;
    }
  }
  return componentClasses;
}

