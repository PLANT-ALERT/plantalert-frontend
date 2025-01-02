export interface User {
    image?: string;
    name: string;
    home: Home
}

interface Home {
    name: string;
    latitude: string;
    longitude: string;
}