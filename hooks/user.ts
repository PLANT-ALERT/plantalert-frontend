import {User, Sensor} from "@/types/user";

export const get_user = async (
    token: string
) => {
    let response = await fetch('http://127.0.0.1:8000/users/' + Number(token), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    let data = await response.json();

    return new User(data);
};

export const get_sensors = async (
    token: string
) => {
    let response = await fetch('http://127.0.0.1:8000/sensors/?user_id=' + Number(token), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    let data = await response.json();

    let array: Sensor[] = [];

    for (let i = 0; i < data.length; i++) {
        array.push(new Sensor(data[i]))
    }

    return array;
};

export const create_user = async (data: {
    username: string,
    email: string,
    password: string,
}) => {
    return await fetch('http://127.0.0.1:8000/users/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
};

export const login = async (
    username: string,
    password: string
) => {
    return await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, password: password})
    });
};