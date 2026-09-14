export function polarToCartesianFromPoint([a,r], _?): [number, number] {
    return polarToCartesian(a,r)
}

export function polarToCartesian(a: number, r: number): [number, number] {
    return [
        r * Math.cos(a),
        r * Math.sin(a)
    ];
}
