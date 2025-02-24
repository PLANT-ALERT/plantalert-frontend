import {API_URL} from "@/utils/enviroment";

export const fetching = async <T>(address: string, post?: boolean, body? : object): Promise<{body: T, code: number} | undefined> => {
    try {
        let response = await fetch(address, {
            method: post ? 'POST' : 'GET',
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
        const response = await fetch(address);

        if ((response as Response).status === 200) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

export const loginWifi = async (address: string, ssid: string, password: string) => {
    try {
        const response = await fetch(address, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ssid: ssid,
                password: password,
            }),
        });

        if (response.status === 200) {
            const data = await response.text(); // Wait for the response text
            return { status: 200, MAC: data };
        }

        if (response.status === 401) {
            return { status: 401 }; // Bad password
        }


        return { status: 500 };
    } catch (error) {
        return { status: 500, error: error };

    }
};

export function returnEndpoint(endpoint: string) : string {
    return API_URL + endpoint;
}
