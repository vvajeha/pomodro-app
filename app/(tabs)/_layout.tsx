import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#8989deff",
      }}
    >
      <Tabs.Screen name="pomodoro" options={{ title: "Pomodoro" }} />
      <Tabs.Screen name="to_do" options={{ title: "To Do" }} />
    </Tabs>
  );
}
