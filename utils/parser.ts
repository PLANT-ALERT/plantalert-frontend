export const parseLocalParameterToNumber = (param: string | string[] | undefined): number | null => {
    if (Array.isArray(param)) {
        return param.length > 0 ? Number(param[0]) : null; // Take the first element if it's an array
    }
    return param ? Number(param) : null; // Convert to number if it's a string
};