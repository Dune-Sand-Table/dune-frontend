import {GalleryItem} from "../../store/GalleryStore/GalleryStore";
import * as React from "preact";
import {polarToCartesianFromPoint} from "../../utils/MathUtils";

export function GalleryItemDisplay(props: { item: GalleryItem; selected?: boolean; loaded?: boolean }) {
    return <svg
        viewBox={"-1.1 -1.1 2.2 2.2"}
        fill={'none'}
        stroke={"black"}
        stroke-width={0.01}
    >
        {props.selected && <rect stroke-linecap={"round"} rx="0.25" x={-1.08} y={-1.08} width={2.16} height={2.16} stroke={"steelblue"} stroke-width={0.03} stroke-dasharray={".1 .1"}/>}
        <circle r={1.05} stroke={"#999"}/>
        <path stroke={props.loaded ? "green" :"black"} d={"M" + props.item.data.map(polarToCartesianFromPoint).join("L")}/>
    </svg>;
}


