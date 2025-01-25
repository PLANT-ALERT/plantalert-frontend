export const translateToPercentage = (value: number, min : number = 420, max: number = 627) => {
    if (value > max) return 0;
    if (value < min) return 100;
    return Math.round(((max - value) / (max - min)) * 100);
};