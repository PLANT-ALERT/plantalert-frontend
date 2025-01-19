export const fetching = async <T>(address: string, post?: boolean): Promise<T> => {
    try {
        const response = await fetch(address, {
            method: post ? "POST" : "GET",
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }


        console.error(response.statusText);
         // Parse response as JSON and cast to type T
        return await response.json();
    } catch (error) {
        throw error; // Re-throw the error for the caller to handle
    }
};

export const health = async (address: string): Promise<boolean> => {
    try {
        const response = await fetch(address, {
            method: "GET",
        });

        if (response.status === 200) {
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
