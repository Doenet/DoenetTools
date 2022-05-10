import * as Aliases from './components/Aliases.js';
import * as MMeMen from './components/MMeMen.js';
import * as MdMdnMrow from './components/MdMdnMrow.js';
import * as BooleanOperators from './components/BooleanOperators.js';
import * as BooleanOperatorsOfMath from './components/BooleanOperatorsOfMath.js';
import * as MathOperators from './components/MathOperators.js';
import * as FunctionOperators from './components/FunctionOperators.js';
import * as TextOperatorsOfMath from './components/TextOperatorsOfMath.js';
import * as Extrema from './components/Extrema.js';
import * as ParagraphMarkup from './components/ParagraphMarkup.js';
import * as SingleCharacterComponents from './components/SingleCharacterComponents.js';
import * as Sectioning from './components/Sectioning.js';
import * as Lists from './components/Lists.js';
import * as DynamicalSystems from './components/dynamicalSystems/index.js';
import * as Chemistry from './components/chemistry/index.js';
import * as FeedbackDefinitions from './components/FeedbackDefinitions.js';
import * as StyleDefinitions from './components/StyleDefinitions.js';
import * as ComponentWithSelectableType from './components/abstract/ComponentWithSelectableType.js';
import * as SideBySide from './components/SideBySide.js';
import * as Indexing from './components/Indexing.js';
import * as Divisions from './components/Divisions.js';
import * as Verbatim from './components/Verbatim.js';
import * as Paginator from './components/Paginator.js';
import * as MatrixInput from './components/MatrixInput.js';

import Document from './components/Document.js';
import Text from './components/Text.js';
import TextList from './components/TextList.js';
import RandomizedTextList from './components/RandomizedTextList.js';
import MathList from './components/MathList.js';
import TupleList from './components/TupleList.js';
import NumberList from './components/NumberList.js';
import NumberListFromString from './components/NumberListFromString.js';
import P from './components/P.js';
import BooleanComponent from './components/Boolean.js';
import BooleanList from './components/BooleanList.js';
import MathComponent from './components/Math.js';
import Copy from './components/Copy.js';
import Extract from './components/Extract.js';
import Collect from './components/Collect.js';
import Ref from './components/Ref.js';
import Point from './components/Point.js';
import Coords from './components/Coords.js';
import Line from './components/Line.js';
import LineSegment from './components/LineSegment.js';
import Ray from './components/Ray.js';
import Polyline from './components/Polyline.js';
import Polygon from './components/Polygon.js';
import Triangle from './components/Triangle.js';
import Rectangle from './components/Rectangle.js';
import Circle from './components/Circle.js';
import Parabola from './components/Parabola.js';
import Curve from './components/Curve.js';
import BezierControls from './components/BezierControls.js';
import ControlVectors from './components/ControlVectors.js';
import PointListComponent from './components/abstract/PointListComponent.js';
import LineListComponent from './components/abstract/LineListComponent.js';
import VectorListComponent from './components/abstract/VectorListComponent.js';
import AngleListComponent from './components/abstract/AngleListComponent.js';
import Vector from './components/Vector.js';
import Angle from './components/Angle.js';
import Answer from './components/Answer.js';
import Award from './components/Award.js';
import When from './components/When.js';
import MathInput from './components/MathInput.js';
import TextInput from './components/TextInput.js';
import BooleanInput from './components/BooleanInput.js';
import ChoiceInput from './components/ChoiceInput.js';
import Choice from './components/Choice.js';
import NumberComponent from './components/Number.js';
import Integer from './components/Integer.js';
import Graph from './components/Graph.js';
import Variables from './components/Variables.js';
import Variable from './components/Variable.js';
import Function from './components/Function.js';
import Template from './components/Template.js';
import Option from './components/Option.js';
import Sequence from './components/Sequence.js';
import Map from './components/Map.js';
import Sources from './components/Sources.js';
import Slider from './components/Slider.js';
import Markers from './components/Markers.js';
import Constraints from './components/Constraints.js';
import ConstrainToGrid from './components/ConstrainToGrid.js';
import ConstrainToGraph from './components/ConstrainToGraph.js';
import AttractToGrid from './components/AttractToGrid.js';
import ConstrainTo from './components/ConstrainTo.js';
import AttractTo from './components/AttractTo.js';
import ConstraintUnion from './components/ConstraintUnion.js';
import AttractToConstraint from './components/AttractToConstraint.js';
import Intersection from './components/Intersection.js';
import Panel from './components/Panel.js';
import ConstrainToAngles from './components/ConstrainToAngles.js';
import AttractToAngles from './components/AttractToAngles.js';
import ConditionalContent from './components/ConditionalContent.js';
import AsList from './components/AsList.js';
import Spreadsheet from './components/Spreadsheet.js';
import DiscreteSimulationResultList from './components/DiscreteSimulationResultList.js';
import DiscreteSimulationResultPolyline from './components/DiscreteSimulationResultPolyline.js';
import Cell from './components/Cell.js';
import Row from './components/Row.js';
import Column from './components/Column.js';
import CellBlock from './components/CellBlock.js';
import Tabular from './components/Tabular.js';
import Table from './components/Table.js';
import Figure from './components/Figure.js';
import VariantNames from './components/VariantNames.js';
import Seeds from './components/Seeds.js';
import VariantControl from './components/VariantControl.js';
import SelectFromSequence from './components/SelectFromSequence.js';
import Select from './components/Select.js';
import Group from './components/Group.js';
import AnimateFromSequence from './components/AnimateFromSequence.js';
import Evaluate from './components/Evaluate.js';
import SelectRandomNumbers from './components/SelectRandomNumbers.js';
import SampleRandomNumbers from './components/SampleRandomNumbers.js';
import Substitute from './components/Substitute.js';
import PeriodicSet from './components/PeriodicSet.js';
import Image from './components/Image.js';
import Video from './components/Video.js';
import Embed from './components/Embed.js';
import Hint from './components/Hint.js';
import Solution from './components/Solution.js';
import IntComma from './components/IntComma.js';
import Pluralize from './components/Pluralize.js';
import Feedback from './components/Feedback.js';
import CollaborateGroups from './components/CollaborateGroups.js';
import CollaborateGroupSetup from './components/CollaborateGroupSetup.js';
import ConsiderAsResponses from './components/ConsiderAsResponses.js';
import Case from './components/Case.js';
import Lorem from './components/Lorem.js';
import UpdateValue from './components/UpdateValue.js';
import CallAction from './components/CallAction.js';
import TriggerSet from './components/TriggerSet.js';
import FunctionIterates from './components/FunctionIterates.js';
import Module from './components/Module.js';
import CustomAttribute from './components/CustomAttribute.js';
import Setup from './components/Setup.js';
import Footnote from './components/Footnote.js';
import Caption from './components/Caption.js';
import Endpoint from './components/Endpoint.js';
import Sort from './components/Sort.js';
import SolveEquations from './components/SolveEquations.js';
import SolutionContainer from './components/SolutionContainer.js';
import SubsetOfRealsInput from './components/SubsetOfRealsInput.js';
import SubsetOfReals from './components/SubsetOfReals.js';
import Split from './components/Split.js';
import BestFitLine from './components/BestFitLine.js';
import RegionBetweenCurveXAxis from './components/RegionBetweenCurveXAxis.js';
import RegionHalfPlane from './components/RegionHalfPlane.js';
import CodeEditor from './components/CodeEditor.js';
import CodeViewer from './components/CodeViewer.js';
import RenderDoenetML from './components/RenderDoenetML.js';
import OrbitalDiagramInput from './components/OrbitalDiagramInput.js';
import OrbitalDiagram from './components/OrbitalDiagram.js';


//Extended
import * as ComponentSize from './components/abstract/ComponentSize.js';
import BaseComponent from './components/abstract/BaseComponent.js';
import InlineComponent from './components/abstract/InlineComponent.js';
import BlockComponent from './components/abstract/BlockComponent.js';
import GraphicalComponent from './components/abstract/GraphicalComponent.js';
import ConstraintComponent from './components/abstract/ConstraintComponent.js';
import Input from './components/abstract/Input.js';
import CompositeComponent from './components/abstract/CompositeComponent.js';
import BooleanBaseOperator from './components/abstract/BooleanBaseOperator.js';
import BooleanBaseOperatorOfMath from './components/abstract/BooleanBaseOperatorOfMath.js';
import MathBaseOperator from './components/abstract/MathBaseOperator.js';
import MathBaseOperatorOneInput from './components/abstract/MathBaseOperatorOneInput.js';
import FunctionBaseOperator from './components/abstract/FunctionBaseOperator.js';
import SectioningComponent from './components/abstract/SectioningComponent.js';
import InlineRenderInlineChildren from './components/abstract/InlineRenderInlineChildren.js';
import TextOrInline from './components/abstract/TextOrInline.js';
import SingleCharacterInline from './components/abstract/SingleCharacterInline.js';

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
  Seeds, VariantNames, VariantControl,
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
  Hint, Solution,
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
  OrbitalDiagramInput,
  OrbitalDiagram,


  BaseComponent,
  InlineComponent,
  BlockComponent,
  GraphicalComponent,
  ConstraintComponent,
  Input,
  CompositeComponent,
  PointListComponent,
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


