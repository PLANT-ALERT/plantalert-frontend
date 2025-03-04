
import {fetching, returnEndpoint} from "@/utils/fetching";

export const registerSensor = async (
    MAC: string, token: string, name: string
) => {
    let data = await fetching<null>(returnEndpoint('/sensors/' + Number(token)), "POST", {user_id: token, mac_address: MAC, name: name});

    return !!(data && data.code == 200);
};
