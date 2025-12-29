import React, { useState, useEffect } from 'react';
import {Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase';
import { router } from "expo-router";
import { createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut, 
    User 
    } from 'firebase/auth';

export default function App () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState <User | null>(null);

    useEffect(() => { // listener for Firebase auth changes 
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            // if user logged in, currentUser is user object
            // if logged out, currentUser is null

            if(currentUser) {
                router.replace("/(tabs)/pomodoro");
            }
        });
        return unsub; // if screen closes, stop listening 
    }, []); 

    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.replace("/")
        } catch (error) {
            if (error instanceof Error) {
                alert('Sign up failed: ' + error.message);
            } else {
                alert("Sign up failed");
            }
        }
    };

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/(tabs)/pomodoro")
        } catch (error) {
            if (error instanceof Error) {
                alert('Sign in failed: ' + error.message);
            } else {
                alert("Sign in failed");
            }        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
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
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={ styles.textInput }
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
            />

            <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={signUp}>
                <Text style={styles.text}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={signIn}>
                <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
       
            <TouchableOpacity style={styles.button} onPress={logOut}>
                <Text style={styles.text}>Log Out</Text>
            </TouchableOpacity>

        </SafeAreaView>
  );
};

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1e212d",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 40,
        color: "#eabf9f",
    },
    textInput: {
        height: 50,
        width: "90%",
        backgroundColor: "#FFFFFF",
        borderColor:  "#E8EAF6",
        borderWidth: 2,
        borderRadius: 15,
        marginVertical: 15,
        paddingHorizontal: 25,
        fontSize: 16,
        color:  "#3C4858",
        shadowColor: "#9E9E9E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4, 
    },
    button: {
        width: "30%",
        marginVertical: 15,
        backgroundColor:"#9E9E9E",
        padding: 20,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#5C6BC0",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5, 
    },
    text: {
        color: "#FFFFFF",
        fontSize: 16, 
        fontWeight: "600",
    },
    status: {
        marginTop: 10,
        color: "#3C4858",
        fontSize: 14,
    },
    logOutButton: {
        backgroundColor: "#EEF2FF",
        shadowColor: "#9E9E9E",
    },
    logoutText: {
        color: "#9E9E9E",
    },
});