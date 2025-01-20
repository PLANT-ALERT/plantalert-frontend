export interface Sensor_Response {
    humidity: number,
    light: number,
    soil: number,
    temp: number
}

export const fetchLastSensor = async (
    MAC: string
) => {
    let response = await fetch('http://127.0.0.1:8000/sensors/last_data/' + MAC + "/", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (response.status == 200) {
        let data : Sensor_Response = await response.json();
        return data;
    }

};
