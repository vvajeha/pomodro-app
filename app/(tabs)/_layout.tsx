import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1e212d"},
        tabBarActiveTintColor: "#eabf9f",
      }}
    />
  );
}
