import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopWidth: 1,
          borderTopColor: '#333',
          height: 80, // Slightly taller for modern look
          paddingTop: 10,
        },
        tabBarIcon: ({ focused }) => {
          let iconName = 'home';
          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'two') iconName = 'barbell';
          else if (route.name === 'calendar') iconName = 'calendar';
          else if (route.name === 'settings') iconName = 'settings';

          return (
            <Ionicons
              name={iconName as keyof typeof Ionicons.glyphMap}
              size={28}
              color={focused ? '#FFF' : '#666'}
              style={{
                opacity: focused ? 1 : 0.8,
              }}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="two" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
