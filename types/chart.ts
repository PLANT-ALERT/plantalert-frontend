export interface chart_GET {
    x: number,
    y: number,
    extraData: {
        formattedValue: string,
        formattedTime: string
    }
}

export interface bulkChart {
    humidity?: chart_GET[],
    soil?: chart_GET[],
    temperature?: chart_GET[],
    light?: chart_GET[],
}