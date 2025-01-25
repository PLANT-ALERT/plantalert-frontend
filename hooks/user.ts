import {User, User_Interface} from "@/types/user";
import {fetching, returnEndpoint} from "@/utils/fetching";

export const registerSensor = async (
    MAC: string, token: string, name: string
) => {
    let data = await fetching<null>(returnEndpoint('/sensors/' + Number(token)), true, {user_id: token, mac_address: MAC, name: name});

    return !!(data && data.code == 200);
};

export const get_user = async (
    token: string
) => {
    let data = await fetching<User_Interface>(returnEndpoint("/users/" + Number(token)));

    if (data)
    return new User(data.body);
};
