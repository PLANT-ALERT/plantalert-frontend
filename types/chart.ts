export interface chart_GET {
    x: number,
    y: number,
    extraData: {
        formattedValue: string,
        formattedTime: string
    }
}

export interface bulkChart {
    humidity: chart_GET[] | null,
    soil: chart_GET[] | null,
    temperature: chart_GET[] | null,
    light: chart_GET[] | null,
}