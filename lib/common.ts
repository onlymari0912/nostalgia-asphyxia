export function firstNode(data: any): any{
    return Array.isArray(data) ? data[0] : data;
}

export function intOr(value: any, fallback: number = 0): number{
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}