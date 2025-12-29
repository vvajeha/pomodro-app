import React, {useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Pomodoro() {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [displayMessage, setMessage] = useState(false);

    useEffect(() => {
        let interval = setInterval(() => {
            clearInterval(interval);

            if (seconds === 0) {
                if(minutes !== 0) {
                    setSeconds(59);
                    setMinutes(minutes - 1);
                } else {
                    let minutes = displayMessage ? 24 : 4;
                    let seconds = 59;

                    setSeconds(seconds);
                    setMinutes(minutes);
                    setMessage(!displayMessage);
                }
            } else {
                setSeconds(seconds - 1);
            }
        }, 1000)
    }, [seconds])

    const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return (
    <SafeAreaView style={styles.container}>
        { displayMessage && <Text style={styles.text}>Break time! New session starts in: </Text>}
        { !displayMessage && <Text style={styles.text}>Stay Focused!</Text>}
         <Text style={styles.timer}>{timerMinutes}:{timerSeconds}</Text>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1e212d",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "#eabf9f",
        fontSize: 20,
    },
    timer: {
        color: "#eabf9f",
        fontSize: 70,
        fontWeight: "800",
        fontFamily: "RobotoMono",
    },
    pomodoro: {
        fontSize: 96,
    },
});