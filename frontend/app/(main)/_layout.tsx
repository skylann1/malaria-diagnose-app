import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00aa93',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Riwayat') iconName = 'time-outline';
          else if (route.name === 'Bantuan') iconName = 'help-circle-outline';
          else if (route.name === 'Akun') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Riwayat" />
      <Tabs.Screen name="Bantuan" />
      <Tabs.Screen name="Akun" />
    </Tabs>
  );
}
