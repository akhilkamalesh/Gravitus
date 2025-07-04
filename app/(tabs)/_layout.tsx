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
          borderTopColor: '#4FD6EA', // blue outline
          height: 70,
          elevation: 8, // Android shadow
          shadowColor: '#4FD6EA', // iOS shadow
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
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
    />
  );
}
