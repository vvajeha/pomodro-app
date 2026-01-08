import {Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RestartButton ({ onPress }) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Ionicons 
            name="refresh" size={28} color="#fff">
            </Ionicons>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#8989deff",
        padding: 16, 
        borderRadius: 50,
    },
});