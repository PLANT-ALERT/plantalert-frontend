import {API_URL} from "@/utils/enviroment";
import axios from 'axios';

enum methods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export const fetching = async <T>(address: string, method: methods | string = "GET", body? : object): Promise<{body: T, code: number} | undefined> => {
    try {
        let response = await fetch(address, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        return {body: (await response.json() as T), code: response.status};
    } catch (error) {
        if (error instanceof TypeError) {
            console.error("Network error or fetch failed:", error.message);
        } else if (error instanceof SyntaxError) {
            console.error("Response is not valid JSON:", error.message);
        } else {
            // @ts-ignore
            console.error("Other error:", error.message);
        }
    }
};

export const health = async (address: string, timeout = 10000): Promise<boolean> => {
    try {
        const response = await axios.get(address);
        if (response.status === 200) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const saveWifiLogin = async (address: string, ssid: string, password: string) => {
    try {
        const response = await axios.post(address, `ssid=${encodeURIComponent(ssid)}&password=${encodeURIComponent(password)}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        // Check if response is successful
        if (response.status === 200) {
            const data = response.data; // Axios automatically parses the response body
            return { status: 200, MAC: data };
        }

        // Handle other status codes
        if (response.status === 400) {
            return { status: 400 }; // Bad password
        }

        return { status: 500 };
    } catch (error) {
        // Axios has built-in error handling with detailed error information
        if (axios.isAxiosError(error)) {
            return { status: 500, error: error.message };
        }
        return { status: 500, error: 'Unknown error' };
    }
};

export function returnEndpoint(endpoint: string) : string {
    return API_URL + endpoint;
}
