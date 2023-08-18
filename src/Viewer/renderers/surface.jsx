import React from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { createFunctionFromDefinition } from "../../Core/utils/function";
import { extend } from "@react-three/fiber";

import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";
extend({ ParametricGeometry });

export default React.memo(function Surface(props) {
    let { name, id, SVs, actions, callAction } = useDoenetRenderer(props);
    // surfaceType(function | paraterization)

    Surface.ignoreActionsWithoutCore = () => true;
    console.log(SVs);
    if (SVs.surfaceType === "" || !SVs.fDefinitions) {
        return null;
    }
    let paraFunc = null;
    if (SVs.surfaceType === "function") {
        const f1 = createFunctionFromDefinition(SVs.fDefinitions[0]);
        paraFunc = (u, v, target) => {
            let x = SVs.par1Min + u * (SVs.par1Max - SVs.par1Min);
            let y = SVs.par2Min + v * (SVs.par2Max - SVs.par2Min);
            target.set(x, y, f1(x, y));
        };
    } else {
        const [f1, f2, f3] = SVs.fDefinitions.map((func) =>
            createFunctionFromDefinition(func),
        );
        paraFunc = (u, v, target) => {
            let scaledU = SVs.par1Min + u * (SVs.par1Max - SVs.par1Min);
            let scaledV = SVs.par2Min + v * (SVs.par2Max - SVs.par2Min);
            target.set(
                f1(scaledU, scaledV),
                f2(scaledU, scaledV),
                f3(scaledU, scaledV),
            );
        };
    }
    return (
        <mesh position={SVs.numericalCenter}>
            <parametricGeometry
                args={[paraFunc, ...SVs.numDiscretizationPoints]}
            />
            <meshNormalMaterial args={[{ side: 2 }]} />
        </mesh>
    );
});
