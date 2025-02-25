export function macAddressToHotspotName(macAddress: string): string {
    // Remove colons
    const cleanedMac = macAddress.replace(/:/g, '');

    // Split the MAC address into chunks of 5 characters
    const chunks: string[] = [];
    for (let i = 0; i < cleanedMac.length; i += 5) {
        chunks.push(cleanedMac.slice(i, i + 5));
    }

    return "PLANTALERT-HOTSPOT-" + chunks[0];
}
