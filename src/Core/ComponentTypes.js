import * as Aliases from './components/Aliases';
import * as MMeMen from './components/MMeMen';
import * as MdMdnMrow from './components/MdMdnMrow';
import * as BooleanOperators from './components/BooleanOperators';
import * as BooleanOperatorsOfMath from './components/BooleanOperatorsOfMath';
import * as MathOperators from './components/MathOperators';
import * as FunctionOperators from './components/FunctionOperators';
import * as TextOperatorsOfMath from './components/TextOperatorsOfMath';
import * as Extrema from './components/Extrema';
import * as ParagraphMarkup from './components/ParagraphMarkup';
import * as SingleCharacterComponents from './components/SingleCharacterComponents';
import * as Sectioning from './components/Sectioning';
import * as Lists from './components/Lists';
import * as DynamicalSystems from './components/dynamicalSystems';
import * as Chemistry from './components/chemistry';
import * as FeedbackDefinitions from './components/FeedbackDefinitions';
import * as StyleDefinitions from './components/StyleDefinitions';
import * as ComponentWithSelectableType from './components/abstract/ComponentWithSelectableType';
import * as SideBySide from './components/SideBySide';
import * as Indexing from './components/Indexing';
import * as Divisions from './components/Divisions';
import * as Verbatim from './components/Verbatim';
import * as Paginator from './components/Paginator';
import * as MatrixInput from './components/MatrixInput';
import * as Solutions from './components/Solutions';

import Document from './components/Document';
import Text from './components/Text';
import TextList from './components/TextList';
import RandomizedTextList from './components/RandomizedTextList';
import MathList from './components/MathList';
import TupleList from './components/TupleList';
import NumberList from './components/NumberList';
import NumberListFromString from './components/NumberListFromString';
import P from './components/P';
import BooleanComponent from './components/Boolean';
import BooleanList from './components/BooleanList';
import MathComponent from './components/Math';
import Copy from './components/Copy';
import Extract from './components/Extract';
import Collect from './components/Collect';
import Ref from './components/Ref';
import Point from './components/Point';
import Coords from './components/Coords';
import Line from './components/Line';
import LineSegment from './components/LineSegment';
import Ray from './components/Ray';
import Polyline from './components/Polyline';
import Polygon from './components/Polygon';
import Triangle from './components/Triangle';
import Rectangle from './components/Rectangle';
import RegularPolygon from './components/RegularPolygon';
import Circle from './components/Circle';
import Parabola from './components/Parabola';
import Curve from './components/Curve';
import BezierControls from './components/BezierControls';
import ControlVectors from './components/ControlVectors';
import PointListComponent from './components/abstract/PointListComponent';
import IntervalListComponent from './components/abstract/IntervalListComponent';
import LineListComponent from './components/abstract/LineListComponent';
import VectorListComponent from './components/abstract/VectorListComponent';
import AngleListComponent from './components/abstract/AngleListComponent';
import Vector from './components/Vector';
import Angle from './components/Angle';
import Answer from './components/Answer';
import Award from './components/Award';
import When from './components/When';
import MathInput from './components/MathInput';
import TextInput from './components/TextInput';
import BooleanInput from './components/BooleanInput';
import ChoiceInput from './components/ChoiceInput';
import Choice from './components/Choice';
import NumberComponent from './components/Number';
import Integer from './components/Integer';
import Graph from './components/Graph';
import Variables from './components/Variables';
import Variable from './components/Variable';
import Function from './components/Function';
import PiecewiseFunction from './components/PiecewiseFunction';
import Interval from './components/Interval';
import Template from './components/Template';
import Option from './components/Option';
import Sequence from './components/Sequence';
import Map from './components/Map';
import Sources from './components/Sources';
import Slider from './components/Slider';
import Markers from './components/Markers';
import Pegboard from './components/Pegboard';
import Constraints from './components/Constraints';
import ConstrainToGrid from './components/ConstrainToGrid';
import ConstrainToGraph from './components/ConstrainToGraph';
import AttractToGrid from './components/AttractToGrid';
import ConstrainTo from './components/ConstrainTo';
import AttractTo from './components/AttractTo';
import ConstraintUnion from './components/ConstraintUnion';
import AttractToConstraint from './components/AttractToConstraint';
import Intersection from './components/Intersection';
import Panel from './components/Panel';
import ConstrainToAngles from './components/ConstrainToAngles';
import AttractToAngles from './components/AttractToAngles';
import ConditionalContent from './components/ConditionalContent';
import AsList from './components/AsList';
import Spreadsheet from './components/Spreadsheet';
import DiscreteSimulationResultList from './components/DiscreteSimulationResultList';
import DiscreteSimulationResultPolyline from './components/DiscreteSimulationResultPolyline';
import Cell from './components/Cell';
import Row from './components/Row';
import Column from './components/Column';
import CellBlock from './components/CellBlock';
import Tabular from './components/Tabular';
import Table from './components/Table';
import Figure from './components/Figure';
import TextListFromString from './components/TextListFromString';
import VariantControl from './components/VariantControl';
import SelectFromSequence from './components/SelectFromSequence';
import Select from './components/Select';
import Group from './components/Group';
import AnimateFromSequence from './components/AnimateFromSequence';
import Evaluate from './components/Evaluate';
import SelectRandomNumbers from './components/SelectRandomNumbers';
import SampleRandomNumbers from './components/SampleRandomNumbers';
import Substitute from './components/Substitute';
import PeriodicSet from './components/PeriodicSet';
import Image from './components/Image';
import Video from './components/Video';
import Embed from './components/Embed';
import Hint from './components/Hint';
import IntComma from './components/IntComma';
import Pluralize from './components/Pluralize';
import Feedback from './components/Feedback';
import CollaborateGroups from './components/CollaborateGroups';
import CollaborateGroupSetup from './components/CollaborateGroupSetup';
import ConsiderAsResponses from './components/ConsiderAsResponses';
import Case from './components/Case';
import Lorem from './components/Lorem';
import UpdateValue from './components/UpdateValue';
import CallAction from './components/CallAction';
import TriggerSet from './components/TriggerSet';
import FunctionIterates from './components/FunctionIterates';
import Module from './components/Module';
import CustomAttribute from './components/CustomAttribute';
import Setup from './components/Setup';
import Footnote from './components/Footnote';
import Caption from './components/Caption';
import Endpoint from './components/Endpoint';
import Sort from './components/Sort';
import Shuffle from './components/Shuffle';
import SolveEquations from './components/SolveEquations';
import SolutionContainer from './components/SolutionContainer';
import SubsetOfRealsInput from './components/SubsetOfRealsInput';
import SubsetOfReals from './components/SubsetOfReals';
import Split from './components/Split';
import BestFitLine from './components/BestFitLine';
import RegionBetweenCurveXAxis from './components/RegionBetweenCurveXAxis';
import RegionHalfPlane from './components/RegionHalfPlane';
import CodeEditor from './components/CodeEditor';
import CodeViewer from './components/CodeViewer';
import RenderDoenetML from './components/RenderDoenetML';
import HasSameFactoring from './components/HasSameFactoring';
import DataFrame from './components/DataFrame';
import SummaryStatistics from './components/SummaryStatistics';
import Chart from './components/Chart';
import Legend from './components/Legend';
import Label from './components/Label';
import MatchesPattern from './components/MatchesPattern';
import Matrix from './components/Matrix';
import EigenDecomposition from './components/linearAlgebra/EigenDecomposition';
import Latex from './components/Latex';
import BlockQuote from './components/BlockQuote';


//Extended
import * as ComponentSize from './components/abstract/ComponentSize';
import BaseComponent from './components/abstract/BaseComponent';
import InlineComponent from './components/abstract/InlineComponent';
import BlockComponent from './components/abstract/BlockComponent';
import GraphicalComponent from './components/abstract/GraphicalComponent';
import ConstraintComponent from './components/abstract/ConstraintComponent';
import Input from './components/abstract/Input';
import CompositeComponent from './components/abstract/CompositeComponent';
import BooleanBaseOperator from './components/abstract/BooleanBaseOperator';
import BooleanBaseOperatorOfMath from './components/abstract/BooleanBaseOperatorOfMath';
import MathBaseOperator from './components/abstract/MathBaseOperator';
import MathBaseOperatorOneInput from './components/abstract/MathBaseOperatorOneInput';
import FunctionBaseOperator from './components/abstract/FunctionBaseOperator';
import SectioningComponent from './components/abstract/SectioningComponent';
import InlineRenderInlineChildren from './components/abstract/InlineRenderInlineChildren';
import TextOrInline from './components/abstract/TextOrInline';
import SingleCharacterInline from './components/abstract/SingleCharacterInline';

const componentTypeArray = [
  ...Object.values(Aliases),
  ...Object.values(MMeMen),
  ...Object.values(MdMdnMrow),
  ...Object.values(BooleanOperators),
  ...Object.values(BooleanOperatorsOfMath),
  ...Object.values(MathOperators),
  ...Object.values(FunctionOperators),
  ...Object.values(TextOperatorsOfMath),
  ...Object.values(Extrema),
  ...Object.values(ParagraphMarkup),
  ...Object.values(SingleCharacterComponents),
  ...Object.values(Sectioning),
  ...Object.values(Lists),
  ...Object.values(DynamicalSystems),
  ...Object.values(Chemistry),
  ...Object.values(FeedbackDefinitions),
  ...Object.values(StyleDefinitions),
  ...Object.values(SideBySide),
  ...Object.values(ComponentWithSelectableType),
  ...Object.values(Indexing),
  ...Object.values(Divisions),
  ...Object.values(Verbatim),
  ...Object.values(Paginator),
  ...Object.values(MatrixInput),
  ...Object.values(Solutions),
  Document,
  Text, TextList,
  RandomizedTextList,
  P,
  BooleanComponent, BooleanList,
  MathComponent, MathList,
  TupleList,
  NumberList,
  NumberListFromString,
  Copy,
  Extract,
  Collect,
  Ref,
  Point, Coords,
  Line, LineSegment, Ray, Polyline,
  Polygon,
  Triangle,
  Rectangle,
  RegularPolygon,
  Circle,
  Parabola,
  Curve,
  BezierControls, ControlVectors,
  Vector,
  Angle,
  Answer, Award, When,
  MathInput, TextInput, BooleanInput, ChoiceInput,
  Choice,
  NumberComponent, Integer,
  Graph,
  Variables,
  Variable,
  Function,
  PiecewiseFunction,
  Interval,
  Template, Option,
  Sequence,
  Slider,
  Spreadsheet,
  DiscreteSimulationResultList,
  DiscreteSimulationResultPolyline,
  Cell,
  Row,
  Column,
  CellBlock,
  Tabular,
  Table,
  Figure,
  Markers,
  Panel,
  Map, Sources,
  Pegboard,
  Constraints,
  ConstrainToGrid,
  ConstrainToGraph,
  AttractToGrid,
  ConstrainTo,
  AttractTo,
  ConstraintUnion,
  AttractToConstraint,
  Intersection,
  ConstrainToAngles, AttractToAngles,
  ConditionalContent,
  AsList,
  VariantControl,
  TextListFromString,
  SelectFromSequence, Select,
  Group,
  AnimateFromSequence,
  Evaluate,
  SelectRandomNumbers,
  SampleRandomNumbers,
  Substitute,
  PeriodicSet,
  Image,
  Video,
  Embed,
  Hint,
  IntComma,
  Pluralize,
  Feedback,
  CollaborateGroups,
  CollaborateGroupSetup,
  ConsiderAsResponses,
  Case,
  Lorem,
  UpdateValue,
  CallAction,
  TriggerSet,
  FunctionIterates,
  Module,
  CustomAttribute,
  Setup,
  Footnote,
  Caption,
  Endpoint,
  Sort,
  Shuffle,
  SolveEquations,
  SolutionContainer,
  SubsetOfRealsInput,
  SubsetOfReals,
  Split,
  BestFitLine,
  RegionBetweenCurveXAxis,
  RegionHalfPlane,
  CodeEditor,
  CodeViewer,
  RenderDoenetML,
  HasSameFactoring,
  DataFrame,
  SummaryStatistics,
  Chart,
  Legend,
  Label,
  MatchesPattern,
  Matrix,
  EigenDecomposition,
  Latex,
  BlockQuote,

  BaseComponent,
  InlineComponent,
  BlockComponent,
  GraphicalComponent,
  ConstraintComponent,
  Input,
  CompositeComponent,
  PointListComponent,
  IntervalListComponent,
  LineListComponent,
  VectorListComponent,
  AngleListComponent,
  BooleanBaseOperator,
  BooleanBaseOperatorOfMath,
  MathBaseOperator, MathBaseOperatorOneInput,
  FunctionBaseOperator,
  ...Object.values(ComponentSize),
  SectioningComponent,
  InlineRenderInlineChildren,
  TextOrInline,
  SingleCharacterInline,
];


export function allComponentClasses() {
  const componentClasses = {};
  const lowerCaseComponentTypes = new Set();
  for (let ct of componentTypeArray) {
    let newComponentType = ct.componentType;
    if (newComponentType === undefined) {
      throw Error("Cannot create component as componentType is undefined for class " + ct)
    }
    let lowerCaseType = newComponentType.toLowerCase();
    if (lowerCaseComponentTypes.has(lowerCaseType)) {
      throw Error("component type " + newComponentType + " defined in two classes");
    }
    componentClasses[newComponentType] = ct;
    lowerCaseComponentTypes.add(lowerCaseType);
  }
  return componentClasses;
}


export function componentTypesCreatingVariants() {
  const componentClasses = {};
  const lowerCaseComponentTypes = new Set();
  for (let ct of componentTypeArray) {
    if (ct.createsVariants) {
      let newComponentType = ct.componentType;
      if (newComponentType === undefined) {
        throw Error("Cannot create component as componentType is undefined for class " + ct)
      }
      let lowerCaseType = newComponentType.toLowerCase();
      if (lowerCaseComponentTypes.has(lowerCaseType)) {
        throw Error("component type " + newComponentType + " defined in two classes");
      }
      componentClasses[newComponentType] = ct;
      lowerCaseComponentTypes.add(lowerCaseType);
    }
  }
  return componentClasses;
}


