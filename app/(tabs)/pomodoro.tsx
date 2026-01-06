import React, {useState, useEffect } from "react";
import { Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlayButton from "../../components/PlayButton";
import PauseButton from "../../components/PauseButton";
import { AnimatedCircularProgress } from 'react-native-circular-progress';


export default function Pomodoro() {
    const WORK = 25 * 60;
    const BREAK = 5 * 60;

    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [displayMessage, setMessage] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const startTimer = () => setIsRunning(true);
    const stopTimer = () => setIsRunning(false);

    useEffect(() => {

        if(!isRunning) {
            return;
        }

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
    }, [seconds, minutes, displayMessage, isRunning])

    const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const totalSeconds = displayMessage ? BREAK : WORK;
    const remainingSeconds = minutes * 60 + seconds;

    const progress = (remainingSeconds / totalSeconds) * 100;

    return (
    <SafeAreaView style={styles.container}>
        {displayMessage && <Text style={styles.text}>Break time! New session starts in: </Text>}
        {!displayMessage && <Text style={styles.text}>Stay Focused!</Text>}

        <AnimatedCircularProgress
          size={210}
          width={15}
          fill={progress}
          duration={1000}
          tintColor="#c3c3d9ff"
          backgroundColor="#3d5875" 
          rotation={0}
          lineCap="round">
            {() => (
             <Text style={styles.timer}>
                {timerMinutes}:{timerSeconds}
            </Text>
            )}
          </AnimatedCircularProgress>
        
        <View style={styles.buttons}>
            <PlayButton onPress={startTimer}></PlayButton>
            <PauseButton onPress={stopTimer}></PauseButton>
        </View>
        
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0f0e47",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "#FBEFEF",
        fontSize: 27,
        marginBottom: 24,
        fontWeight: "800",
    },
    timer: {
        color: "#FBEFEF",
        fontSize: 35,
        fontWeight: "800",
        fontFamily: "RobotoMono",
    },
    pomodoro: {
        fontSize: 96,
    },

    buttons: {
        flexDirection: "row",
        gap: 16,
        marginTop: 28,
    },
});