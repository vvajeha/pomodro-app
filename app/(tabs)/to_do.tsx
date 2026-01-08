
import React, {useState, useEffect } from "react";
import { Text, StyleSheet, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, query, where, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { router } from 'expo-router';

export default function TabTwoScreen() {
    const [task, setTask] = useState('');
    const [todos, setTodos] = useState<any>( [] );
    const user = auth.currentUser;
    const todosCollection = collection(db, 'todos');

    useEffect(() => {
        fetchTodos();
    }, [user]);

    const fetchTodos = async () => { 
        if (user) {
            const q = query(todosCollection, where('userId', "==", user.uid));
            const data = await getDocs(q);
            setTodos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } else {
            console.log("No user logged in");
        }
    };

    const addTodo = async () => {
        if (task.trim().length === 0) {
            return;
        } 
        if (user) {
            await addDoc(todosCollection, { task, completed: false, userId: user.uid })
            setTask('');
            fetchTodos();
        } else {
            console.log("No user logged in");
        }
    };

    const updateTodo = async ( id: string, completed: any ) => {
        const todoDoc = doc(db, 'todos', id);
        await updateDoc(todoDoc, { completed: !completed });
        fetchTodos();
    };

    const deleteTodo = async ( id: string ) => {
        const todoDoc = doc(db, 'todos', id);
        await deleteDoc(todoDoc);
        fetchTodos();
    };
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>To Do List</Text>
                
            <TouchableOpacity style={styles.logOutButton} onPress={logOut}>
                <Text style={styles.logOutText}>Log Out</Text>
            </TouchableOpacity> 

            <View style={styles.inputContainer}>
                <TextInput
                placeholder="New Task"
                value={task}
                onChangeText={setTask}
                style={styles.input}
                placeholderTextColor="#8b8bb0"
                />
                <TouchableOpacity style = {styles.addButton} onPress={addTodo}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            

            <FlatList 
            data={todos} 
            contentContainerStyle={{paddingHorizontal: 12, paddingBottom: 30}}
            renderItem={({ item }) => (
                <View style={styles.todoContainer}>
                    <Text style={[styles.todoText, item.completed && styles.todoCompleted]}>{item.task}</Text>

                    <TouchableOpacity style={styles.smallButton} onPress={() => updateTodo(item.id, item.completed)}>
                        <Text style={styles.smallButtonText}>{item.completed ? "Undo" : "Complete"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.smallButton} onPress={() => deleteTodo(item.id)}>
                        <Text style={styles.smallButtonText}>Delete</Text>
                    </TouchableOpacity>

                </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: "#0f0e47",
        position: 'relative',
    },

    container: {
        flex: 1,
        backgroundColor: "#0f0e47",
        padding: 12,
    },

    title: {
        fontSize: 35,
        fontWeight: '800',
        marginBottom: 25,
        color: "#FBEFEF",
        textAlign: 'center',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 18,
        gap: 12,
        paddingHorizontal: 8,
    },

    input: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#272757",
        backgroundColor: "#FBEFEF",
        shadowColor: "#9E9E9E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4, 
    },

    addButton: {
        height: 48,
        paddingHorizontal: 18,
        borderRadius: 14, 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#8989deff",
        shadowColor: "#5C6BC0",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5, 
    },
    
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: '800',
    },

    todoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14, 
        borderRadius: 15, 
        backgroundColor: "#FBEFEF",
        borderColor: "#F9DFDF",
        borderWidth: 2,
        marginBottom: 12,
        shadowColor: "#9E9E9E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },

    button: {
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#b7b7d8ff",
        shadowColor: '#5C6BC0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,   
        marginLeft: 10,
    },
    smallButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "#b7b7d8ff",
        marginLeft: 8,
    },
    smallButtonText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#0f0e47",
    },

    todoText: {
        flex: 1,
        fontSize: 18,
        fontWeight: "700",
        color: "#272757",
        letterSpacing: 0.3,
    },

    todoCompleted: {
        textDecorationLine: "line-through",
        color: "#a0a0c0",
    },
    logOutButton: {
        backgroundColor: "#8989deff",
        marginTop: 16, 
        paddingHorizontal: 14, 
        paddingVertical: 8, 
        borderRadius: 10, 
        position: 'absolute',
        right: 16,
        top: 2,
        elevation: 50,
    },
    logOutText: {
        color: '#fff',
        fontWeight: '800',
    },
});