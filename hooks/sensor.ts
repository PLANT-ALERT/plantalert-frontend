import {API_URL} from "@/utils/enviroment";

export interface Sensor_Response {
    humidity: number,
    light: number,
    soil: number,
    temp: number
}

export const fetchLastSensor = async (
    MAC: string
) => {
    let response = await fetch(API_URL + '/sensors/last_data/humidity/' + MAC + "/", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.status == 200) {
        let data : {humidity: string} = await response.json();
        return Number(data.humidity);
    }

};
