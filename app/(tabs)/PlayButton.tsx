import {Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PlayButton ({ onPress }) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Ionicons 
            name="play" size={28} color="#fff">
            </Ionicons>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#eabf95",
        padding: 16, 
        borderRadius: 50,
    },
});