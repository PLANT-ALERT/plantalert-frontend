import {API_URL} from "@/utils/enviroment";
export interface flower_GET {
    id: number;
    name: string;
    image?: string;
    light?: number;
    soil_humidity?: {
        min?: number;
        max?: number;
    }
    air_humidity?: {
        min?: number;
        max?: number;
    }
    air_temperature?: {
        min?: number;
        max?: number;
    }

}

export interface sensors_GET {
    name: string,
    mac_address: string,
    age?: number,
    flower_id?: number,
    home_id?: number,
    id: number,
    description: string,
    created_at: string,
    user_id: number
}

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

