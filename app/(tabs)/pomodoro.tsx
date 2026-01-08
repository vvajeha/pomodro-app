import React, {useState, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlayButton from "../../components/PlayButton";
import PauseButton from "../../components/PauseButton";
import RestartButton from "@/components/RestartButton";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';


export default function Pomodoro() {
    const WORK = 25 * 60;
    const BREAK = 5 * 60;

    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [progressKey, setProgressKey] = useState(0);
    const [displayMessage, setMessage] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    const startTimer = () => setIsRunning(true);
    const stopTimer = () => setIsRunning(false);
    const restartTimer = () => {
        setIsRunning(false); // pause the timer
        setMessage(false); // back to work mode
        setMinutes(25);
        setSeconds(0);
        setProgressKey(prev => prev + 1) // reset progress
    }

    useEffect(() => {

        if(!isRunning) { // stop the timer 
            return;
        }

        let interval = setInterval(() => {
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
        }, 1000);
        return () => clearInterval(interval);
    }, [seconds, minutes, displayMessage, isRunning])

    const timerMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const timerSeconds = seconds < 10 ? `0${seconds}` : seconds;
    
    const totalSeconds = displayMessage ? BREAK : WORK;
    const remainingSeconds = minutes * 60 + seconds;
    const progress = (remainingSeconds / totalSeconds) * 100;

    const logOut = async () => {
        try {
            await signOut(auth);
            router.replace("/");
        } catch (error) {
                if (error instanceof Error) {
                alert('Sign out failed: ' + error.message);
            } else {
                alert("Sign out failed!");
            }
        }
    };
    
    return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.logOutButton} onPress={logOut}>
                <Text style={styles.logOutText}>Log Out</Text>
        </TouchableOpacity> 
        
        <View style={styles.timerContainer}>
                {displayMessage && <Text style={styles.text}>Break time! New session starts in: </Text>}
                {!displayMessage && <Text style={styles.text}>Stay Focused!</Text>}
            <AnimatedCircularProgress
                key={progressKey}
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
                <PauseButton onPress={stopTimer}></PauseButton>
                <PlayButton onPress={startTimer}></PlayButton>
                <RestartButton onPress={restartTimer}></RestartButton>
            </View>
        </View>
      
        
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0f0e47",
        flex: 1,
        alignItems: "center",
    },
    header: {
        marginTop: 90,
        alignItems: 'center',
        width: '100%', 
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        flexDirection: 'row',
    },
    timerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginTop: 30,
    },
    logOutButton: {
        backgroundColor: "#8989deff",
        marginTop: 16, 
        paddingHorizontal: 14, 
        paddingVertical: 8, 
        borderRadius: 10, 
        position: 'absolute',
        right: 16, 
        top: 10, 
    },
    logOutText: {
        color: '#fff',
        fontWeight: '800',
    },
});