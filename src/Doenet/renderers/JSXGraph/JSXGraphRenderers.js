import GraphRenderer from './GraphRenderer';
import PointRenderer from './PointRenderer';
import LineRenderer from './LineRenderer';
import LineSegmentRenderer from './LineSegmentRenderer';
import VectorRenderer from './VectorRenderer';
import PolylineRenderer from './PolylineRenderer';
import PolygonRenderer from './PolygonRenderer';
import AngleRenderer from './AngleRenderer';
import CircleRenderer from './CircleRenderer';
import CurveRenderer from './CurveRenderer';

let availableRenderers = Object.assign({}, 
  GraphRenderer,
  PointRenderer,
  LineRenderer,
  LineSegmentRenderer,
  VectorRenderer,
  PolylineRenderer,
  PolygonRenderer,
  AngleRenderer,
  CircleRenderer,
  CurveRenderer,
);

export default availableRenderers;
