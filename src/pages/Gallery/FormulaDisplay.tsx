import {useMemo} from "preact/compat";
import * as React from "preact";

function FormulaDisplay(props: { f: string }) {

    const d = useMemo(() => {
        const f = new Function("a", `{
            const {sqrt, sin, cos, tan, atan, atan2, log, pow, PI, round, ceil, floor} = Math;
            return ` + props.f + ";\n}"
        );
        const points = []
        for (let i = 0; i < 3600; i++) {
            const a = i / 180 * Math.PI;
            const r = f(a) * 45;
            const x = Math.cos(a) * r
            const y = Math.sin(a) * r
            points.push([x, y])
        }
        return "M" + points.join("L");
    }, [props.f]);

    return <svg viewBox={"-50 -50 100 100"} width={125} height={125}>
        <path d={d} fill={'none'} stroke={"black"}/>
    </svg>;
}