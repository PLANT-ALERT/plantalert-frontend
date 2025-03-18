import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function LastConnectionStatus(props: { date: Date }) {
    const { date } = props;
    const [nowDate, setNowDate] = useState(new Date());

    useEffect(() => {
        setNowDate(new Date());
    }, [date]);

    const minutesDifference = Math.floor((nowDate.getTime() - date.getTime()) / (1000 * 60));
    const isRecent = minutesDifference <= 30;

    const backgroundColor = isRecent ? "green" : "red";

    const formatTime = (val: number) => val.toString().padStart(2, "0");

    return (
        <View style={{ width: "100%", backgroundColor, padding: 10 }}>
            {nowDate.getDate() === date.getDate() ? (
                <Text style={{ textAlign: "center", color: "white" }}>
                    {`${formatTime(date.getHours())}:${formatTime(date.getMinutes())}:${formatTime(date.getSeconds())}`}
                </Text>
            ) : (
                <Text style={{ textAlign: "center", color: "white" }}>
                    {`${formatTime(date.getDate())}.${formatTime(date.getMonth() + 1)}.${date.getFullYear()} ${formatTime(date.getHours())}:${formatTime(date.getMinutes())}:${formatTime(date.getSeconds())}`}
                </Text>
            )}
        </View>
    );
}
