import {RefObject} from 'preact';
import {PreviewCanvasProps} from "./PreviewCanvasProps";

const traversedPathColor = '#2196f3';
const remainingPathColor = '#b7b7b7';

export function draw(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    props: PreviewCanvasProps,
    pointsCartesian: [number, number][]
): void {

    const canvas = canvasRef.current;
    if (!canvas)
        return;

    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;

    const w = canvas.width;
    const h = canvas.height;
    const maxRadius = (w / 2) - 40;

    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);

    drawBg(ctx, maxRadius);
    drawLine(ctx, pointsCartesian, maxRadius, props.targetPointIndex);

    ctx.fillStyle = "black";
    ctx.font = "28px Arial";

    ctx.textAlign = "left";
    props.leftText && ctx.fillText(props.leftText, -w / 2 + 20, -h / 2 + 30);

    ctx.textAlign = "right";
    props.rightText && ctx.fillText(props.rightText, w / 2 - 20, -h / 2 + 30);

    if (pointsCartesian?.length) {
        drawPoints(ctx, pointsCartesian, maxRadius, props.targetPointIndex);
    } else {
        ctx.font = "60px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("NO DATA", 0, 0);
    }

    ctx.restore();
}

function drawBg(ctx: CanvasRenderingContext2D, maxRadius: number) {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, maxRadius * 1.05, 0, 2 * Math.PI);
    // ctx.moveTo(-maxRadius, 0); ctx.lineTo(maxRadius, 0);
    // ctx.moveTo(0, -maxRadius); ctx.lineTo(0, maxRadius);
    ctx.stroke();
}

function drawLine(
    ctx: CanvasRenderingContext2D,
    points: [number, number][],
    maxRadius: number,
    targetPointIndex?:number
) {
    if (!points || points.length === 0)
        return
    ctx.strokeStyle = targetPointIndex ? traversedPathColor : remainingPathColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0][0] * maxRadius, points[0][1] * maxRadius);
    for (let i = 1; i < points.length; i++) {
        const [x, y] = points[i]
        ctx.lineTo(x * maxRadius, y * maxRadius);
        if (targetPointIndex !== null && i === targetPointIndex) {
            ctx.stroke();
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = remainingPathColor;
            ctx.moveTo(x * maxRadius, y * maxRadius);
        }
    }
    ctx.stroke();
}

function drawPoints(
    ctx: CanvasRenderingContext2D,
    points: [number, number][],
    maxRadius: number,
    targetPointIndex?:number
) {
    if (!points)
        return
    ctx.fillStyle = '#ff5722';
    points.forEach(([x, y], i) => {
        if (targetPointIndex && i < targetPointIndex)
            return
        ctx.beginPath();
        ctx.arc(x * maxRadius, y * maxRadius, 2, 0, 2 * Math.PI);
        ctx.fill();
    });
}



