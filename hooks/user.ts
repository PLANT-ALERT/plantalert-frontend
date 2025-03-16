
import {fetching, returnEndpoint} from "@/utils/fetching";

export const registerSensor = async (
    MAC: string, token: string, name: string
) => {
    try {
        let data = await fetching<null>(returnEndpoint('/sensors'), "POST",
            {
                user_id: token,
                home_id: 0,
                name: name,
                description: null,
                mac_address: MAC,
                location: null,
                age: 0,
                flower_id: null
            }
            );
        return !!(data && data.code == 200);
    } catch (error) {
        console.error("Sensor de registro de errores: " + error);
    }

};
