import * as React from 'preact';
import {draw} from "./draw";
import {PreviewCanvasProps} from "./PreviewCanvasProps";
import {useEffect, useMemo, useRef} from "preact/compat";
import {polarToCartesianFromPoint} from "../../utils/MathUtils";

export function PreviewCanvas(props: PreviewCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const points = useMemo(() => {
        return props.pointsPolar?.map(polarToCartesianFromPoint)
    }, [props.pointsPolar])

    useEffect(() => {
        draw(canvasRef, props, points);
    }, [points, props.targetPointIndex, props.leftText, props.rightText]);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={800}
            className="preview-canvas"
        />
    );
}
