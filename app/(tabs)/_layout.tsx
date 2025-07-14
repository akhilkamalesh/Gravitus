import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#121417',
          borderTopWidth: 2,
          borderTopColor: '#4FD6EA',
          height: 70,
          elevation: 8,
          shadowColor: '#4FD6EA',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
        },
        tabBarIcon: ({ focused }) => {
          let iconName = 'home';
          if (route.name === 'index') iconName = 'home';
          else if (route.name === 'two') iconName = 'barbell';
          else if (route.name === 'settings') iconName = 'settings';

          return (
            <Ionicons
              name={iconName as keyof typeof Ionicons.glyphMap}
              size={28}
              color={focused ? '#4FD6EA' : '#888'}
              style={{
                shadowColor: focused ? '#4FD6EA' : 'transparent',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 6,
              }}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="two" />
      <Tabs.Screen name="settings"/>
    </Tabs>
  );
}
