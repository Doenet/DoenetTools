import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";

export default React.memo(function Sphere(props) {
  let { name, id, SVs, actions, callAction } = useDoenetRenderer(props);

  Sphere.ignoreActionsWithoutCore = () => true;

  if (SVs.hidden) {
    return null;
  }

  return (
    <mesh position={SVs.numericalCenter}>
      <sphereGeometry args={[SVs.radius]} />
      <meshStandardMaterial />
    </mesh>
  );
});
