import JSXGraphRenderers from './renderers/JSXGraph/JSXGraphRenderers';
import ContainerRenderer from './renderers/ContainerRenderer';
import MathinputRenderer from './renderers/MathinputRenderer';
import TextinputRenderer from './renderers/TextinputRenderer';
import BooleaninputRenderer from './renderers/BooleaninputRenderer';
import ChoiceinputRenderer from './renderers/ChoiceinputRenderer';
import ChoiceRenderer from './renderers/ChoiceRenderer';
import MathRenderer from './renderers/MathRenderer';
import TextRenderer from './renderers/TextRenderer';
import PRenderer from './renderers/PRenderer';
import SliderRenderer from './renderers/SliderRenderer';
import AnswerRenderer from './renderers/AnswerRenderer';
import UpdateValueRenderer from './renderers/UpdateValueRenderer';
import PanelRenderer from './renderers/PanelRenderer';
import AsListRenderer from './renderers/AsListRenderer';
import SpreadsheetRenderer from './renderers/SpreadsheetRenderer';
import TableRenderer from './renderers/TableRenderer';
import SectionRenderer from './renderers/SectionRenderer';
import ParagraphMarkupRenderers from './renderers/ParagraphMarkupRenderers';
import SingleCharacterRenderers from './renderers/SingleCharacterRenderers';
import ImageRenderer from './renderers/ImageRenderer';
import VideoRenderer from './renderers/VideoRenderer';
import UrlRenderer from './renderers/UrlRenderer';
import HintRenderer from './renderers/HintRenderer';
import SolutionRenderer from './renderers/SolutionRenderer';
import ListRenderer from './renderers/ListRenderer';
import LinkRenderer from './renderers/LinkRenderer';
import FeedbackRenderer from './renderers/FeedbackRenderer';


let availableRenderers = Object.assign({},
  JSXGraphRenderers,
  ContainerRenderer,
  MathinputRenderer,
  TextinputRenderer,
  BooleaninputRenderer,
  ChoiceinputRenderer,
  ChoiceRenderer,
  MathRenderer,
  TextRenderer,
  PRenderer,
  SliderRenderer,
  AnswerRenderer,
  UpdateValueRenderer,
  PanelRenderer,
  AsListRenderer,
  SpreadsheetRenderer,
  TableRenderer,
  SectionRenderer,
  ParagraphMarkupRenderers,
  SingleCharacterRenderers,
  ImageRenderer,
  UrlRenderer,
  VideoRenderer,
  HintRenderer, SolutionRenderer,
  ListRenderer,
  LinkRenderer,
  FeedbackRenderer,
);

export default availableRenderers;
