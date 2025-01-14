import {Line} from 'react-native-simple-line-chart';
import {getColors} from "@/constants/Colors";

let colors = getColors();

enum Charts {
    AIR_HUMADITY = "air-humidity",
    AIR_TEMPATURE = "air-tempature",
    SOIL_HUMADITY = "soil-humidity",
    LIGHT = "light",
    DEMO = "demo",
}

export const getChartData = (chartData: Charts | string) : Line[] | undefined => {
    if (chartData === Charts.DEMO) {
        let lines : Line[] = [
            {
                data: generateDemoData(),
                curve: "monotone",
                lineColor: colors.tint,
            },
        ];
        return lines;
    }

    return undefined;
}

const generateDemoData = () => {
    const data = [];
    const startDate = new Date('2020-01-01');

    for (let i = 0; i < 20; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);

        const yValue = Math.floor(Math.random() * 50) + 1; // Random y value between 1 and 50

        data.push({
            y: yValue,
            x: currentDate.getTime(),
            extraData: {
                formattedValue: `${yValue}$`,
                formattedTime: currentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            },
        });
    }

    return data;
};
