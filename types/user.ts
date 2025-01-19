interface User_Interface {
    home_id: number,
    username: string,
    email: string,
    image: string,
    created_at: string,
}

export class User {
    home_id: number;
    username: string;
    email: string;
    image: string;

    constructor(user: User_Interface) {
        this.home_id = user.home_id;
        this.username = user.username;
        this.email = user.email;
        this.image = user.image;
    }
}

interface Sensor_Interface {
    user_id: 5,
    home_id: number,
    name: string,
    description: string,
    mac_address: string,
    location: [number, number],
    age: number,
    flower_id: number,
    created_at: string
}

export class Sensor {
    home_id: number;
    name: string;
    description: string;
    mac_address: string;
    age: number;
    flower_id: number;
    created_at: Date;

    constructor(user: Sensor_Interface) {
        this.home_id = user.home_id;
        this.name = user.name;
        this.description = user.description;
        this.mac_address = user.mac_address;
        this.age = user.age;
        this.flower_id = user.flower_id;
        this.created_at = new Date(user.created_at);
    }
}

interface Home {
    name: string;
    latitude: string;
    longitude: string;
}