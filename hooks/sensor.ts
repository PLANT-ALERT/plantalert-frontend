import {API_URL} from "@/utils/enviroment";
export interface oneFlower {
    user_id: number;
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

export interface flower_GET {
    user_flowers: oneFlower[];
    default_flowers: oneFlower[];
    other_flowers: oneFlower[];
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


